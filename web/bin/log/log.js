/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global cunovs, __FILE__, Java, PotalUnits, SystemEvent, CertManager, com */

cunovs.defineCalss(__FILE__, {
    sql : "",
    appendSql:function(str){
        this.sql += (!this.sql ? " where ":" and ");
        this.sql += str;
    },
    service: function (jjs) {
        this.sql = "";
	var startRow = jjs.get("page") || 0, rowCount = jjs.get("pageSize") || 10 , userId = jjs.getUserId(), db = new cunovsDB("plat");
        startRow = (startRow <= 1) ? 1 : (startRow - 1) * rowCount;
        var fTime = jjs.get("ENTRY_DATE[0]") , sTime = jjs.get("ENTRY_DATE[1]") , combo = jjs.get("CATEGORY") , conText = jjs.get("CONTENT") ,  catText = jjs.get("catText")
        var sb ="select $date_str(ENTRY_DATE,120),LOG_LEVEL,CONTENT,CATEGORY,RECORDER from $[plat].Log";
        fTime && this.appendSql("ENTRY_DATE>=$str_date('"+fTime+"',121)");
        sTime && this.appendSql("ENTRY_DATE<$str_date('"+sTime+"',121)");
        combo && this.appendSql("LOG_LEVEL="+combo);
        conText && this.appendSql("CONTENT like '%"+conText+"%'");
        catText && this.appendSql("CATEGORY like '%"+catText+"%'");
        
        var mcount = db.getRow("select count(*) from $[plat].Log " + this.sql);
        var rs = db.get(sb + this.sql + " order by ENTRY_DATE desc", startRow , rowCount) , data = [];
        print(sb + this.sql + " , " + startRow + " , " + rowCount + " , " + mcount[0] + " , " + rs.length + " , uid : " + userId);
        if(rs && rs.length)
            for(var i = 0 ; i< rs.length ; i++)
                data.push({"ENTRY_DATE" : rs[i][0] , "LOG_LEVEL" : rs[i][1] , "CONTENT" : rs[i][2] , "CATEGORY" : rs[i][3] , "RECORDER" : rs[i][4]})
        return {
            total : mcount[0] || 0,
            data : data
        }
    }
});


