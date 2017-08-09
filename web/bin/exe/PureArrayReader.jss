/*
 * Ext JS Library 2.2 Copyright(c) 2006-2008, Ext JS, LLC. licensing@extjs.com
 * 
 * http://extjs.com/license
 */

/**
 * @class bin.exe.PureArrayReader
 * @extends Ext.data.ArrayReader Data reader class to create an Array of
 *          {@link Ext.data.Record} objects from an Array. Each element of that
 *          Array represents a row of data fields. The fields are pulled into a
 *          Record object using as a subscript, the <em>mapping</em> property
 *          of the field definition if it exists, or the field's ordinal
 *          position in the definition.<br>
 *          <p>
 *          Example code:.
 * 
 * <pre><code>
 * var Employee = Ext.data.Record.create([{
 * 			name : 'name',
 * 			mapping : 1
 * 		}, // &quot;mapping&quot; only needed if an &quot;id&quot; field is present which
 * 		{
 * 			name : 'occupation',
 * 			mapping : 2
 * 		} // precludes using the ordinal position as the index.
 * ]);
 * var myReader = new bin.exe.PureArrayReader({
 * 	id : 0
 * 		// The subscript within row Array that provides an ID for the Record (optional)
 * 	}, Employee);
 * </code></pre>
 * 
 * <p>
 *          This would consume an Array like this:
 * 
 * <pre><code>
 * [[1, 'Bill', 'Gardener'], [2, 'Ben', 'Horticulturalist']]
 * </code></pre>
 * 
 * @cfg {String} id (optional) The subscript within row Array that provides an
 *      ID for the Record
 * @constructor Create a new PureArrayReader
 * @param {Object}
 *            meta Metadata configuration options.
 * @param {Object}
 *            recordType Either an Array of field definition objects as
 *            specified to {@link Ext.data.Record#create}, or a
 *            {@link Ext.data.Record Record} constructor created using
 *            {@link Ext.data.Record#create}.
 */
bin.exe.PureArrayReader = Ext.extend(Ext.data.ArrayReader, {
	/**
	 * Create a data block containing Ext.data.Records from an Array.
	 * 
	 * @param {Object}
	 *            o An Array of row objects which represents the dataset.
	 * @return {Object} data A data block which is used by an Ext.data.Store
	 *         object as a cache of Ext.data.Records.
	 */
	readRecords : function(o) {
		var data;
		if (typeof(o.totalRecords) != 'undefined') {
			if (typeof(this.meta) == 'undefined')
				this.meta = {};
			this.meta.id = o.id;

			this.meta.totalRecords = o.totalRecords;
			data = o.data;
		} else
			data = o;
		var r = bin.exe.PureArrayReader.superclass.readRecords.call(this, data);
		return {
			records : r.records,
			totalRecords : this.meta.totalRecords || r.records.length,
			success : true
		};
	}
});