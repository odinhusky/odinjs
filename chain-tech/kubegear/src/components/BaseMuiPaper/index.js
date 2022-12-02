import React, { useEffect, useState } from 'react';

// ^ Material-ui Componets(Functions)
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';
import TableBody from '@material-ui/core/TableBody';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';

// ? styles
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles';

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  pagination: {
    '& .MuiTablePagination-selectRoot': {
      fontSize: '14px'
    }
  }
}))

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isUndefined, cloneDeep, get, isNil } from 'lodash';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';

/**
 * @author elvis
 * @prop {array} columns -- TableHead 每一個欄位
 * @prop {function} setPage -- 設定現在是在哪一頁
 * @prop {number} page -- 當前的頁數(第一頁是 0)
 * @prop {function} setRowsPerPage -- 設定每一頁顯示幾筆
 * @prop {number} rowsPerPage -- 每一頁顯示幾筆的數字
 * @prop {string} labelRowsPerPage -- '每行幾頁'的文字，可自由替換
 * @prop {array} rowsPerPageOptions -- 可以提供一次顯示幾筆資料的陣列選項
 * eg. [10, 50, 100]
 * @prop {array} rows -- 處理好的要顯示的資料
 * @prop {object} PaperStyle -- Paper style
 * @prop {object} TableContainerStyle -- TableContainer 這個 component 的 style 物件
 * @prop {number || undefined} exceptionActionGivenTotalCount -- 當後端有幫忙做分頁功能的時候，需要給定總數才能work
 * @prop {function instance} ordering -- 排序的依據
 * @prop {number} selectionMode -- 選擇表格模式
 * 0 (ckeckbox all)
 * 1 (each row checkbox, not include header checkbox)
 * @prop {function} itemCheckedChange --
 * @prop {function} itemCheckedAllChange --
 * @prop {object} itemCheckedProps --
 * @prop {object} itemCheckedData --
 * @prop {boolean} itemChecked --
 * @prop {object} classNameObj -- className 的物件
 * @prop {object} dragObj -- 控制是否可以拖曳的功能
 * dragObj: {
 *  isDraggable: true || false,
 *  dragAction: {
 *    onBeforeCapture={(e) => console.log('onBeforeCapture: ', e)}
      onBeforeDragStart={(e) => console.log('onBeforeDragStart: ', e)}
      onDragEnd={(e) => console.log('onDragEnd: ', e)}
      onDragStart={(e) => console.log('onDragStart: ', e)}
      onDragUpdate={(e) => console.log('onDragStart: ', e)}
 *  }
 * }
 * @description 加入相對應必要參數，完成表格
 * @return 表格元件
*/

function BasePaper({
  columns,
  setPage,
  page,
  setRowsPerPage,
  rowsPerPage,
  labelRowsPerPage,
  rowsPerPageOptions = [10, 50, 100],
  rowsPerPageOptionsRemoveAll = false,
  rows,
  PaperStyle,
  TableContainerStyle,
  exceptionActionGivenTotalCount,
  ordering,
  selectionMode,
  itemCheckedChange,
  itemCheckedAllChange,
  itemCheckedProps,
  itemCheckedData = [],
  itemChecked = false,
  getKey,
  isLoading,
  classNameObj,
  onChangePage,
  onChangeRowsPerPage,
  dragObj
}) {

  // $ init data
  const { t } = useTranslation();
  const classes = useStyles();
  const isDraggable = !isNil(dragObj) && get(dragObj, 'isDraggable', false);
  const dragActions = isDraggable && get(dragObj, 'dragActions', {});

  // # states
  const [everyPageItems, setEveryPageItems] = useState([]);

  // - methods
  const selectedModeColumns = (selected) => {
    const newColumns = [...columns]
    switch (selected) {
      case 0:
        newColumns.unshift({ id: 'checkedMode', key: 'checkedMode' })
        return newColumns
      case 1:
        newColumns.unshift({ id: 'checkedMode', key: 'checkedMode' })
        return newColumns
      default:
        return columns
    }
  }

  const defaultColumns = selectedModeColumns(selectionMode).map(item => {
    const result = { ...item };

    if (result.key === 'checkedMode') {
      result.onTableCellRender = (row) => {
        if (itemChecked) {
          return (
            <Checkbox
              checked={itemCheckedData.indexOf(row) > -1}
              inputProps={{ 'aria-label': 'select all desserts' }}
              onChange={(e, checked) => itemCheckedChange(e, checked, row)}
              {...itemCheckedProps}
            />
          )
        } else {
          return (
            <Checkbox
              inputProps={{ 'aria-label': 'select all desserts' }}
              onChange={(e, checked) => itemCheckedChange(e, checked, row)}
              {...itemCheckedProps}
            />
          )
        }
      }
    }

    if (!result.onTableCellRender) {
      result.onTableCellRender = (row) => {
        const value = row[item.id];
        return item.format !== undefined
          ? Array.isArray(value) ? item.format(value) : value
          : value
      }
    }

    return result;
  })

  /**
   * @author odin
   * @param {string} type -- 要輸出的樣式種類
   * @param {object} field -- 單個 column 傳進來的物件
   * @description 抽取特定種類的 style 物件
   * @return style 物件
  */
  const extractCellStyle = (type, field) => {
    const { cellStyle } = field;

    if(type === 'th' && cellStyle) {
      const { th } = cellStyle;
      return th ? th : {};
    } else if(type === 'td' && cellStyle) {
      const { td } = cellStyle;
      return td ? td : {};
    }
  }

  /**
   * @author odin
   * @param {array} row -- 單個 td 的資料
   * @param {number} index -- 該資料在陣列中的 index
   * @description 渲染出 tr + 很多個 td 的結構
   * @return tr > td * n 的 Dom
  */
  const returnTdCell = (row, index) => {
    // console.log('row', row)
    // console.log('index', index)
    // console.log('defaultColumns', defaultColumns)

    // 如果要改變背景色的話，得在 column 第一個物件中加入比對的 activeId，並且為目前 selected 的 id
    const activeId = defaultColumns[0].activeId;
    const isSelected = (!isUndefined(activeId)) && (!isUndefined(row.id)) && (activeId === row.id);

    return isDraggable ? (
      <Draggable
        draggableId={`draggable-${row.order}`}
        index={index}
      >
        {(provided) => (
          <TableRow
            className={`${isSelected && classes.bg_selected}`}
            key={index}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {
              defaultColumns.map(field => {

                const tdStyle = extractCellStyle('td', field)
                const { width } = field
                return (
                  <TableCell
                    className={`${classNameObj?.td}`}
                    key={field.id}
                    style={{ ...tdStyle }}
                    width={width}
                  >
                    {field.onTableCellRender(row)}
                  </TableCell>
                )
              })
            }
          </TableRow>
        )}
      </Draggable>
    ) : (
      <TableRow
        className={`${isSelected && classes.bg_selected}`}
        key={index}
      >
        {
          defaultColumns.map(field => {

            const tdStyle = extractCellStyle('td', field)
            const { width } = field
            return (
              <TableCell
                className={`${classNameObj?.td}`}
                key={field.id}
                style={{ ...tdStyle }}
                width={width}
              >
                {field.onTableCellRender(row)}
              </TableCell>
            )
          })
        }
      </TableRow>
    )
  };

  const handleChangePage = (event, newPageIndex) => {
    setPage(newPageIndex);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // * hooks
  useEffect(() => {
    if (rows.length > 0) {
      const result = [];
      for (let i = 0; i < Math.ceil(rows.length / rowsPerPage); i++) {
        result.push({
          page: i,
          items: rows.slice(i * rowsPerPage, i * rowsPerPage + rowsPerPage)
        })
      }
      setEveryPageItems(result)
    }
  }, [rows])

  const handleCheckedAllBoxBoolean = (everyPageItems, page, itemCheckedData) => {
    if (everyPageItems.find(item => item.page === page)) {
      const { items } = everyPageItems.find(item => item.page === page)
      return items.every((item) => (itemCheckedData.indexOf(item) > -1))
    }
    return false
  }

  return (
    <Paper
      className={`${classNameObj?.paper}`}
      elevation={0}
      square
      style={
        isLoading
          ? { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', borderRadius: 4 }
          : { display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 4, ...PaperStyle }
      }
    >
      {
        isLoading
          ? <CircularProgress />
          :
          <>
            <TableContainer style={{ backgroundColor: '#fff', position: 'relative', flex: 1, borderRadius: 4, ...TableContainerStyle }}>
              <Table
                className={`${classNameObj?.table}`}
                stickyHeader
                style={{ tableLayout: 'auto', whiteSpace: 'nowrap' }}
              >
                <TableHead className={`${classNameObj?.thead}`}>
                  <TableRow>
                    {
                      selectionMode === 0 &&
                      <TableCell
                        padding="checkbox"
                        style={{ textAlign: 'center', padding: 0 }}
                      >
                        <Checkbox
                          checked={handleCheckedAllBoxBoolean(everyPageItems, page, itemCheckedData)}
                          // checked={rowCount > 0 && numSelected === rowCount}
                          // indeterminate={numSelected > 0 && numSelected < rowCount}
                          inputProps={{ 'aria-label': 'select all desserts' }}
                          onChange={(e, checked) => {
                            const selectedItems = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            itemCheckedAllChange(e, checked, selectedItems)
                          }}
                        />
                      </TableCell>
                    }
                    {
                      selectionMode === 1 &&
                      <TableCell
                        padding="checkbox"
                        style={{ textAlign: 'center', padding: 0 }}
                      />
                    }
                    {
                      columns.map(field => {
                        const { width } = field;
                        const thStyle = extractCellStyle('th', field);

                        if (field.onColumnClick === undefined) {
                          return (
                            <TableCell
                              className={`${classNameObj?.th}`}
                              key={field.id}
                              style={{
                                ...thStyle
                              }}
                              width={width}
                            >
                              {field.label}
                            </TableCell>
                          )
                        } else {
                          return (
                            <TableCell
                              className={`${classNameObj?.th}`}
                              key={field.id}
                              style={{
                                ...thStyle
                              }}
                              width={width}
                            >
                              <TableSortLabel
                                active={field.id === ordering.field ? true : false}
                                direction={
                                  field.onColumnClick !== undefined
                                    ?
                                    field.id === ordering.field
                                      ? ordering.descending ? 'desc' : 'asc'
                                      : 'asc'
                                    :
                                    'asc'
                                }
                                onClick={
                                  field.onColumnClick !== undefined
                                    ? (e) => {
                                      field.onColumnClick(e, field.id)
                                    }
                                    : () => {}
                                }
                              >
                                {field.label}
                              </TableSortLabel>
                            </TableCell>
                          )
                        }
                      })
                    }
                  </TableRow>
                </TableHead>

                {
                  // 判斷能不能夠拖曳
                  isDraggable ? (
                    <DragDropContext
                      {...cloneDeep(dragActions)}
                    >
                      <Droppable droppableId="drop-id">
                        {(provided) => (
                          <TableBody
                            className={`${classNameObj?.tbody}`}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {
                              // 根據
                              // 1. 一次打完API取得所有的筆數
                              // 2. 後端先過濾過的資料
                              // 兩種不同的狀況，利用這個判斷來分別渲染結果到畫面上
                              (() => {
                                const data = ((rows.length <= rowsPerPage) || (rowsPerPage === -1)) ? rows : rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                return data.map((row, index) => (returnTdCell(row, getKey ? getKey(row) : index)))
                              })()
                            }
                            {provided.placeholder}
                          </TableBody>
                        )}
                      </Droppable>
                    </DragDropContext>
                  ) : (
                    <TableBody
                      className={`${classNameObj?.tbody}`}
                    >
                      {
                        // 根據
                        // 1. 一次打完API取得所有的筆數
                        // 2. 後端先過濾過的資料
                        // 兩種不同的狀況，利用這個判斷來分別渲染結果到畫面上
                        (() => {
                          const data = ((rows.length <= rowsPerPage) || (rowsPerPage === -1)) ? rows : rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          return data.map((row, index) => (returnTdCell(row, getKey ? getKey(row) : index)))
                        })()
                      }
                    </TableBody>
                  )
                }

              </Table>
            </TableContainer>
            <TablePagination
              className={classes.pagination}
              component="div"
              count={exceptionActionGivenTotalCount ? exceptionActionGivenTotalCount : rows.length}
              labelDisplayedRows={({ from, to, count }) => (
                `${from}-${to} ${t('of')} ${count !== -1 ? count : `more than ${to}` }`)
              }
              labelRowsPerPage={
                labelRowsPerPage ? labelRowsPerPage : t('labelRowsPerPage')
              }
              onChangePage={onChangePage || handleChangePage}
              onChangeRowsPerPage={onChangeRowsPerPage || handleChangeRowsPerPage}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={
                rowsPerPageOptionsRemoveAll
                  ? [...rowsPerPageOptions]
                  : [...rowsPerPageOptions, { label: 'All', value: -1 }]
              }
            />
          </>
      }
    </Paper>
  )
}

BasePaper.propTypes = {
  columns: PropTypes.array.isRequired,
  setPage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  setRowsPerPage: PropTypes.func.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  labelRowsPerPage: PropTypes.string,
  rowsPerPageOptions: PropTypes.array,
  rowsPerPageOptionsRemoveAll: PropTypes.bool,
  rows: PropTypes.array.isRequired,
  PaperStyle: PropTypes.object,
  TableContainerStyle: PropTypes.object,
  exceptionActionGivenTotalCount: PropTypes.number,
  ordering: PropTypes.object,
  selectionMode: PropTypes.number,
  itemCheckedChange: PropTypes.func,
  itemCheckedAllChange: PropTypes.func,
  itemCheckedProps: PropTypes.object,
  itemCheckedData: PropTypes.array,
  itemChecked: PropTypes.bool,
  getKey: PropTypes.func,
  isLoading: PropTypes.bool,
  classNameObj: PropTypes.object,
  onChangePage: PropTypes.func,
  onChangeRowsPerPage: PropTypes.func,
  dragObj: PropTypes.object
};

export default BasePaper;
