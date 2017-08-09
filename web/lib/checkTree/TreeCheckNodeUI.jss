/**
* 功能点: 1. 支持级联改变节点选择状态，包括向父节目级联及向子节点级联
*          2. 某节点被全选时，仅返回该节点而不返回其被选中的子节点
* 
* 代码改动：1. 把TreeNodeUI的checked属性由true|false扩展为'all'|'part'|'none'三态
*          2. 重写了TreePanel的getChecked方法
*          
* 使用说明：1. 同普通TreePanel，把Ext.tree.TreePanel换成Ext.ux.TreeCheckPanel   
*          2. 把Ext.tree.TreeLoader换成Ext.ux.TreeCheckLoader
*          3. 新增两个参数onlyLeafCheckable及checkModel
*             onlyLeafCheckable(true|false)控制是否只有叶子节点可选
*             checkModel('single'|'multiple')控制单选还是多选，以某分支中最上级全选节点视为一个节点     
* 示例：       
*   var tree = new Ext.ux.TreeCheckPanel({
*               id : 'tree',
*               width : 230,
*               height : 250,
*               autoScroll : true,
*               animate : true,
*              //onlyLeafCheckable : true,
*              //checkModel : 'single',
*               checkModel : 'multiple',
*               containerScroll : true,
*               lines : true,// 节点之间连接的横竖线
*               rootVisible : false,// 是否显示根节点
*               root : new Ext.tree.AsyncTreeNode({
*                           text : 'root',
*                           id : 'root'
*                       }),
*               loader : new Ext.ux.TreeCheckLoader({
*                           dataUrl : 'tree.json'
*                       })
*           });
*/

Ext.ux.TreeCheckNodeUI = function() {
this.checkModel = 'multiple';
// only leaf can checked
this.onlyLeafCheckable = false;
Ext.ux.TreeCheckNodeUI.superclass.constructor.apply(this, arguments);
};

Ext.extend(Ext.ux.TreeCheckNodeUI, Ext.tree.TreeNodeUI, {
    renderElements : function(n, a, targetNode, bulkRender) {
     var tree = n.getOwnerTree();
     this.checkModel = tree.checkModel || this.checkModel;
     this.onlyLeafCheckable = tree.onlyLeafCheckable || false;
     // add some indent caching, this helps performance when
     // rendering a large tree
     this.indentMarkup = n.parentNode ? n.parentNode.ui
       .getChildIndent() : '';
     // var cb = typeof a.checked == 'boolean';
     var cb = (!this.onlyLeafCheckable || a.leaf);
     var checkImg = cb
       ? '<img style="margin-bottom:-3px;" src="/themes/images/'
         + n.attributes.checked + '.gif">'
       : '';
     var href = a.href ? a.href : Ext.isGecko ? "" : "#";
     var buf = [
       '<li class="x-tree-node"><div ext:tree-node-id="',
       n.id,
       '" class="x-tree-node-el x-tree-node-leaf x-unselectable ',
       a.cls,
       '" unselectable="on">',
       '<span class="x-tree-node-indent">',
       this.indentMarkup,
       "</span>",
       '<img src="',
       this.emptyIcon,
       '" class="x-tree-ec-icon x-tree-elbow" />',
       '<img src="',
       a.icon || this.emptyIcon,
       '" class="x-tree-node-icon',
       (a.icon ? " x-tree-node-inline-icon" : ""),
       (a.iconCls ? " " + a.iconCls : ""),
       '" unselectable="on" />',
       checkImg,
       '<a hidefocus="on" class="x-tree-node-anchor" href="',
       href,
       '" tabIndex="1" ',
       a.hrefTarget ? ' target="' + a.hrefTarget + '"' : "",
       '><span unselectable="on">',
       n.text,
       "</span></a></div>",
       '<ul class="x-tree-node-ct" style="display:none;"></ul>',
       "</li>"].join('');
     var nel;
     if (bulkRender !== true && n.nextSibling
       && (nel = n.nextSibling.ui.getEl())) {
      this.wrap = Ext.DomHelper.insertHtml("beforeBegin", nel,
        buf);
     } else {
      this.wrap = Ext.DomHelper.insertHtml("beforeEnd",
        targetNode, buf);
     }
     this.elNode = this.wrap.childNodes[0];
     this.ctNode = this.wrap.childNodes[1];
     var cs = this.elNode.childNodes;
     this.indentNode = cs[0];
     this.ecNode = cs[1];
     this.iconNode = cs[2];
     var index = 3;
     if (cb) {
      this.checkbox = cs[3];
      Ext.fly(this.checkbox).on('click',
        this.onCheck.createDelegate(this, [null]));
      index++;
     }
     this.anchor = cs[index];
     this.textNode = cs[index].firstChild;
     n.on('beforeexpand', function(n) {
        if (n.attributes.checked == 'all') {
         n.ui.childCheck(n, 'all');
        }
       });
    },
    // private
    onCheck : function() {
     var arr = this.node.getOwnerTree().getChecked();
     if (this.checkModel == 'single' && arr.length == 1 && arr[0].id != this.node.id) {
      arr[0].ui.check('none');
     }
     this.check(this.toggleCheck(this.node.attributes.checked));
    },
    check : function(checked) {
     var n = this.node;
     n.attributes.checked = checked;
     this.setNodeIcon(n);
     this.childCheck(n, n.attributes.checked);
     this.parentCheck(n);// 影响父节点的选中状态
    },
    parentCheck : function(node) {
     var currentNode = node;
     // 由当前节点开始，向上递归
     while ((currentNode = currentNode.parentNode) != null) {
      if (!currentNode.getUI().checkbox)
       continue;
      var part = false;
      var sel = 0;// 记录当前节点中被选中的子节点数
      Ext.each(currentNode.childNodes, function(child) {// 如果子节点全部checked
         // ==
         // 'all',父节点也为全选,否则为半选
         if (child.attributes.checked == 'all')
          sel++;
         else if (child.attributes.checked == 'part') {
          part = true;
          return false;
         }
        });
      if (part)
       currentNode.attributes.checked = 'part';
      else {
       var selType = null;
       if (sel == currentNode.childNodes.length) {
        currentNode.attributes.checked = 'all';
       } else if (sel == 0) {
        currentNode.attributes.checked = 'none';
       } else {
        currentNode.attributes.checked = 'part';
       }
      }
      this.setNodeIcon(currentNode);
     };
    },
    setNodeIcon : function(n) {
     if (n.getUI() && n.getUI().checkbox)
      n.getUI().checkbox.src = '/themes/images/' + n.attributes.checked
        + '.gif';
    },
    // private
    childCheck : function(node, checked) {
     // node.expand(true,true);
     if (node.childNodes)
      Ext.each(node.childNodes, function(child) {
         child.attributes.checked = checked;
         this.setNodeIcon(child);
         this.childCheck(child, checked);
        }, this);
    },
    expandCheck : function(node) {
     if (node.attributes.checked == 'all') {
      node.ui.childCheck(n, 'all');
     }
    },
    toggleCheck : function(value) {
     return (value == 'all' || value == 'part') ? 'none' : 'all';
    }
   });

Ext.ux.TreeCheckPanel = function() {
Ext.ux.TreeCheckPanel.superclass.constructor.apply(this, arguments);
};
Ext.extend(Ext.ux.TreeCheckPanel, Ext.tree.TreePanel, {
    /**
    * etrieve an array of checked nodes
    */
    getChecked : function(a, startNode) {
     startNode = startNode || this.root;
     var r = [];
     var f = function() {
      if (this.attributes.checked == 'all') {
       r.push(!a ? this : (a == 'id' ? this.getDepth() + '-' + this.id: this.attributes[a]));
 
       return false;
      }
     };
     startNode.cascade(f);
     return r;
    }
   });

Ext.ux.TreeCheckLoader = function() {
this.baseAttrs = {
   uiProvider : Ext.ux.TreeCheckNodeUI
};
Ext.ux.TreeCheckLoader.superclass.constructor.apply(this, arguments);
};
Ext.extend(Ext.ux.TreeCheckLoader, Ext.tree.TreeLoader);

