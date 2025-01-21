import PageDeskTopHeader from '@components/PageDeskTopHeader';

export const FeedBackDesktopHeader = () => {
  // const { handleFeedBackPageClick } = useFeedBackPageActions();

  // const onBack = () => {
  //   handleFeedBackPageClick({
  //     actionName: handleFeedBackPageDesktopHeaderBackBtnClick,
  //   });
  // };

  return (
    <PageDeskTopHeader
      headerTitle={{ i18nKey: 'help_center_header_help_center' }}
      classNameObj={{
        container: 'mb-5',
      }}
    />
  );
};

export default FeedBackDesktopHeader;
