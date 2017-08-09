

--META_TABLE

delete from PLATFORM_EXT.META_TABLE;

INSERT INTO PLATFORM_EXT.META_TABLE (LNAME ,PNAME ,     OBJECT_ID ,TYPE ,DBLINK ,AUTH ) select TAB_LNAME, TAB_PNAME, object_ID, TABLE_TYPE, DATABASE_LINK, DATA_AUTH from PLATFORM_EXT.RESTAB_DESC






--META_COLUMN

delete from PLATFORM_EXT.META_COLUMN;

INSERT INTO PLATFORM_EXT.META_COLUMN (OBJECT_ID ,ID ,data_type, LNAME ,PNAME ,LENGTH ,NOT_NULL , DEFAULT_VALUE ,SPECIAL_SET ,UNIT ,DECIMAL_DIGITS , SERIAL ) select  b.object_id, TABITEM_ID,12, TABITEM_LNAME, TABITEM_PNAME, FLENGTH, NULLABLE, DEFAULT_STR, SPECIAL_SET, UNIT, DECIMALDIGITS, 0 from PLATFORM_EXT.RESTAB_DETAIL a,PLATFORM_EXT.RESTAB_DESC b where a.tab_id=b.tab_id

update PLATFORM_EXT.META_COLUMN set data_type=2 where id in(select TABITEM_ID from PLATFORM_EXT.RESTAB_DETAIL where DATA_TYPE='int')

update PLATFORM_EXT.META_COLUMN set data_type=6 where id in(select TABITEM_ID from PLATFORM_EXT.RESTAB_DETAIL where DATA_TYPE='float')

update PLATFORM_EXT.META_COLUMN set data_type=2005 where id in(select TABITEM_ID from PLATFORM_EXT.RESTAB_DETAIL where DATA_TYPE='clob')

update PLATFORM_EXT.META_COLUMN set data_type=2004 where id in(select TABITEM_ID from PLATFORM_EXT.RESTAB_DETAIL where DATA_TYPE='blob')

update PLATFORM_EXT.META_COLUMN set data_type=91 where id in(select TABITEM_ID from PLATFORM_EXT.RESTAB_DETAIL where DATA_TYPE='smalldatetime')

update PLATFORM_EXT.META_COLUMN set data_type=12,length=1 where  data_type is null

update platform_ext.meta_column set not_null='true' where not_null='是'

update platform_ext.meta_column set not_null='false' where not_null='否'







--META_APPENDIX

insert into platform_ext.meta_appendix select b.object_id, a.tabitem_id,2,a.option_id,'option_id' from platform_ext.restab_detail a,platform_ext.restab_desc b where a.tab_id=b.tab_id and a.option_id is not null and a.option_id>0


insert into platform_ext.meta_appendix select b.object_id, a.tabitem_id,2,a.seq,'seqence' from platform_ext.restab_detail a,platform_ext.restab_desc b where a.tab_id=b.tab_id and a.seq is not null

insert into platform_ext.meta_appendix select b.object_id, a.tabitem_id,12,a.remark,'remark' from platform_ext.restab_detail a,platform_ext.restab_desc b where a.tab_id=b.tab_id and a.remark is not null








--META_CONSTRAINT,META_CONSTRAINT_DETAIL

INSERT INTO PLATFORM_EXT.META_CONSTRAINT (OBJECT_ID , CONSTRAINT_NAME ,CONSTRAINT_TYPE ,LINK_TABLE , DELETE_FLAG ) select b.object_id, a.CONSTRAINT_NAME, a.CONSTRAINT_TYPE, a.LINK_TABLE, a.DELETE_FLAG from PLATFORM_EXT.CONSTRAINT_MASTER a,PLATFORM_EXT.RESTAB_DESC b where a.tab_id=b.tab_id

INSERT INTO PLATFORM_EXT.META_CONSTRAINT_DETAIL (OBJECT_ID , CONSTRAINT_NAME ,ITEM_ID ,LINK_ITEM ) select b.object_id, a.CONSTRAINT_NAME, a.ITEM_ID, a.LINK_ITEM from PLATFORM_EXT.CONSTRAINT_DETAIL a,PLATFORM_EXT.RESTAB_DESC b where a.tab_id=b.tab_id








--OBJECT_BASE

update platform_ext.object_base set parent_id=62282 where parent_id=62285

update platform_ext.object_base set parent_id=62339 where parent_id=62342

update platform_ext.object_base set parent_id=62350 where parent_id=62353

update   platform_ext.ctrl_input  a   set   a.tab_id= (select  object_id  from   platform_kty.restab_desc b   where  a.tab_id=b.tab_id) where a.tab_id= (select b.tab_id  from   platform_kty.restab_desc b   where  a.tab_id=b.tab_id);

update   platform_ext.ctrl_search  a   set   a.tab_id= (select  object_id  from   platform_kty.restab_desc b   where  a.tab_id=b.tab_id) where a.tab_id= (select b.tab_id  from   platform_kty.restab_desc b   where  a.tab_id=b.tab_id);

update   platform_ext.ctrl_lst  a   set   a.tab_id= (select  object_id  from   platform_kty.restab_desc b   where  a.tab_id=b.tab_id) where a.tab_id= (select b.tab_id  from   platform_kty.restab_desc b   where  a.tab_id=b.tab_id);


--QUERY

INSERT INTO PLATFORM_EXT.APP_QUERY (FORDER_ID, QUERY_ID, QUERY_NAME, CONTENT, IS_JOIN, SEQ,TYPE ) select FORDER_ID, QUERY_ID, QUERY_NAME, CONTENT, IS_JOIN,  SEQ,1 from PLATFORM_KTY.APP_QUERY

 insert into PLATFORM_EXT.APP_QUERY_COLUMN(QUERY_ID, COLUMN_NAME, POINT, ORDER_ID)  select QUERY_ID, COLUMN_NAME, POINT, ORDER_ID from PLATFORM_KTY.APP_QUERY_COLUMN 


 insert into   PLATFORM_EXT.APP_QUERY_IMPORT(QUERY_ID, ALIAS, IMPORT_NAME, PARAM_NAME, PARAM_VALUE) select QUERY_ID, ALIAS, IMPORT_NAME, PARAM_NAME, PARAM_VALUE from PLATFORM_KTY.APP_QUERY_IMPORT 

 insert into PLATFORM_EXT.APP_QUERY_PARAM( QUERY_ID, ORDER_ID, UTYPE, PARAM_NAME, NULLABLE, PERFIX, SUFFIX, DEFAULT_VALUE ) select QUERY_ID, ORDER_ID, UTYPE, PARAM_NAME, NULLABLE, PERFIX, SUFFIX, DEFAULT_VALUE from PLATFORM_KTY.APP_QUERY_PARAM




