import React, { useState } from 'react';


// ^ Material-ui Components(Functions)
import Radio from '@material-ui/core/Radio';

// ? Self-packed Components || Functions
import BasePaper from 'components/BaseMuiPaper';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/JobSubmit/Footer/TemplateModal/Table
 * @param {boolean} isOpen -- 是否開啟的 boolean
 * @param {function} onClose -- 關閉的 function
 * @component Table
 * @description Table component to show templates
*/
const Table = ({ data, setSelectionDetail }) => {

  // $ init data
  const { t } = useTranslation();

  // # states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedValue, setSelectedValue] = useState();

  // - methods
  const handleChange = (id, data) => {
    setSelectedValue(id);
    setSelectionDetail([data])
  };

  // & handled data
  const columns = [
    {
      id: 'radio',
      key: 'Radio',
      onTableCellRender: (data) => {
        const { id } = data;
        return (
          <Radio
            checked={selectedValue === id}
            name="radio-button"
            onChange={() => handleChange(id, data)}
            value={id}
          />
        )
      }
    },
    {
      id: 'name',
      key: 'name',
      label: t('name')
    },
    {
      id: 'owner',
      key: 'owner',
      label: t('owner')
    },
    {
      key: 'image',
      label: t('image'),
      isResizable: true,
      onTableCellRender: (data) => {
        return (
          <div>
            {data.jobConfig.prerequisites.map(taskRole => taskRole.uri).join(', ')}
          </div>
        )
      }
    },
    {
      id: 'description',
      key: 'description',
      label: t('description')
    }
  ]
  return (
    <BasePaper
      columns={columns}
      // itemCheckedChange={(e, checked, row) => {
      //   if (checked) {
      //     setSelectionDetail(prev => ([...prev, row]))
      //   } else {
      //     setSelectionDetail(prev => ([...prev].filter(selected => selected.name !== row.name)))
      //   }
      // }}
      labelRowsPerPage={t('labelRowsPerPage')}
      page={page}
      rows={data}
      rowsPerPage={rowsPerPage}
      // selectionMode={1}
      setPage={setPage}
      setRowsPerPage={setRowsPerPage}
    />
  );
};

Table.propTypes = {
  data: PropTypes.array,
  setSelectionDetail: PropTypes.func
};

export default Table;