import React from 'react';

import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import Pagination from './pagination';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

Paginator.propTypes = {
  dataLength: PropTypes.number,
  pagination: PropTypes.object,
  setPagination: PropTypes.func
};

export default function Paginator(props) {
  const { t } = useTranslation();
  const { pagination, setPagination, dataLength } = props;
  const { itemsPerPage, pageIndex } = pagination;
  const length = dataLength ? dataLength : 0;
  const maxPageIndex = Math.floor(length / itemsPerPage);
  const start = itemsPerPage * pageIndex + 1;
  const end = Math.min(itemsPerPage * (pageIndex + 1), length);

  /** @type {import('office-ui-fabric-react').ICommandBarItemProps[]} */
  const farItems = [];

  /** @type {import('office-ui-fabric-react').IButtonStyles} */
  const buttonStyles = {
    root: { backgroundColor: 'white' },
    rootDisabled: { backgroundColor: 'white' }
  };

  function onClickItemsPerPage(event, { key }) {
    setPagination(new Pagination(key));
  }

  farItems.push({
    key: 'itemsPerPage',
    text: t('perPage', { perPage: itemsPerPage }),
    buttonStyles,
    menuIconProps: { iconName: 'ChevronUp' },
    subMenuProps: {
      items: [10, 50, 100].map(number => ({
        key: String(number),
        text: String(number),
        onClick: onClickItemsPerPage
      }))
    }
  });

  farItems.push({
    key: 'range',
    // text: `${start}-${end} of ${length}`,
    text: `${start}-${end} ${t('in')} ${length}`,
    buttonStyles,
    checked: true,
    disabled: true
  });

  /**
   * @param {number} pageIndex
   */
  function setPage(pageIndex) {
    /**
     * @param {React.MouseEvent<Button>} event
     */
    return function onClick() {
      setPagination(new Pagination(pagination.itemsPerPage, pageIndex));
    };
  }

  /**
   * @param {number} page
   * @returns {import('office-ui-fabric-react').ICommandBarItemProps}
   */
  function getPageButton(page) {
    return {
      key: `page-${page}`,
      text: String(page + 1),
      buttonStyles,
      onClick: setPage(page)
    };
  }


  if (pageIndex !== 0) {
    farItems.push({
      key: 'page-previous',
      buttonStyles,
      iconProps: { iconName: 'ChevronLeft' },
      iconOnly: true,
      onClick: setPage(pageIndex - 1)
    });
  }

  if (pageIndex > 3) {
    farItems.push(
      getPageButton(0),
      getPageButton(1),
      { key: 'page-ellipsis-left', disabled: true, text: '...', buttonStyles },
      getPageButton(pageIndex - 1),
    );
  } else {
    for (let i = 0; i < pageIndex; i += 1) {
      farItems.push(getPageButton(i));
    }
  }

  farItems.push({ key: `page-${pageIndex}`, checked: true, text: String(pageIndex + 1) });

  if (maxPageIndex - pageIndex > 3) {
    farItems.push(
      getPageButton(pageIndex + 1),
      { key: 'page-ellipsis-right', disabled: true, text: '...', buttonStyles },
      getPageButton(maxPageIndex - 1),
    );
  } else {
    for (let i = pageIndex + 1; i < maxPageIndex; i += 1) {
      farItems.push(getPageButton(i));
    }
  }

  if (length % itemsPerPage !== 0 && pageIndex !== maxPageIndex)
    farItems.push(getPageButton(maxPageIndex));

  if (pageIndex !== maxPageIndex && (length % itemsPerPage === 0 && pageIndex !== maxPageIndex - 1)) {
    farItems.push({
      key: 'page-next',
      buttonStyles,
      iconProps: { iconName: 'ChevronRight' },
      iconOnly: true,
      onClick: setPage(pageIndex + 1)
    });
  }


  return (
    <CommandBar
      farItems={farItems}
      styles={{ root: { backgroundColor: 'white' } }}
    />
  );
}
