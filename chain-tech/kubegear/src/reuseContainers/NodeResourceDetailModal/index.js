import React, {
  useEffect,
  useState
} from 'react';

// ^ Material-ui Components(Functions)
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

// ? Self-packed Components || Functions
import BaseModalNew from 'components/BaseModalNew';
import {
  DefaultButton
  // PrimaryButton
} from 'components/BaseButton';
// ? styles
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme)
}))

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isNil, isEmpty } from 'lodash';

/**
 * @author odin
 * @level views/JobSubmit/TaskRole/Content/SelectResource/NodeResourceDetailModal
 * @param {boolean} isOpen -- 是否開啟的 boolean
 * @param {function} onClose -- 關閉的 function
 * @param {object} showNodes -- 所有要顯示的資料
 * @component NodeResourceDetailModal
 * @description NodeResourceDetailModal component
*/
const NodeResourceDetailModal = ({
  isOpen,
  onClose,
  showNodes
}) => {

  // $ init data
  const { t } = useTranslation();

  // = styles
  const classes = useStyles();

  // # states
  const [nodeList, setNodeList] = useState([]);
  const [selectedNode, setSelectedNode] = useState('');
  const [selectedNodeContent, setSelectedNodeContent] = useState({
    cpuLeft: 0,
    gpuLeft: 0,
    memoryLeft: 0,
    gpuPercentageLeftArr: [100]
  });


  // * hooks
  /**
   * @author odin
   * @description
   * 1. 取出有哪些節點
   * 2. 預設第一筆資料為預設值
  */
  useEffect(() => {
    if(isNil(showNodes) || isEmpty(showNodes) || isEmpty(showNodes.nodes)) return;

    const nodes = showNodes.nodes;
    const currentNodeContent = showNodes[nodes[0]];

    setNodeList(nodes);
    setSelectedNode(nodes[0]);
    setSelectedNodeContent(currentNodeContent)
  }, [showNodes]);

  return (
    <BaseModalNew
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            onClick={onClose}
          />
        </>
      }
      onClose={onClose}
      title={t('remainingResource')}
    >
      <div className={`${classes.nodeResourceDetailModalContainer}`}>
        <div className={`${classes.w_full}`}>
          <FormControl
            className={`${classes.unlimitWidthSelect}`}
            fullWidth
          >
            <Select
              onChange={(e) => {
                const nodeName = e.target.value;
                setSelectedNode(nodeName);
                setSelectedNodeContent(showNodes[nodeName]);
              }}
              value={selectedNode}
              variant="outlined"
            >
              {nodeList.map((item) => {
                return (
                  <MenuItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </div>

        {/* CPU */}
        <div className={`${classes.w_full} ${classes.mt_20} ${classes.mb_10}`}>CPU: {selectedNodeContent.cpuLeft}</div>

        {/* GPU */}
        <div className={`${classes.w_full} ${classes.mb_10}`}>GPU: {selectedNodeContent.gpuLeft}</div>

        {/* CPU */}
        <div className={`${classes.w_full} ${classes.mb_10} ${classes.d_flex}`}>
          <div className={`${classes.mr_10}`}>GPU Percentage:</div>
          <div>
            {
              selectedNodeContent.gpuPercentageLeftArr.map((item, index, arr) => (
                <>
                  <div className={`${(index + 1 !== arr.length) && classes.mb_10}`}> {index + 1} - { `${item}%` } </div>
                </>
              ))
            }
          </div>
        </div>

        {/* Memory */}
        <div className={`${classes.w_full}`}>Memory: {selectedNodeContent.memoryLeft} MB</div>
      </div>
    </BaseModalNew>
  );
};

NodeResourceDetailModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  showNodes: PropTypes.object
};

export default NodeResourceDetailModal;