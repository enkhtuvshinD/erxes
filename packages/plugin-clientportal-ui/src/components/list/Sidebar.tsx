import ClientPortalIdFilter from '../../containers/ClientPortalIdFilter';
import { Counts } from '@erxes/ui/src/types';
import DateFilters from '@erxes/ui-forms/src/forms/containers/DateFilters';
import React from 'react';
import TypeFilter from '../../containers/TypeFilter';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { isEnabled } from '@erxes/ui/src/utils/core';
import SegmentFilter from '../../containers/SegmentFilter';

type Props = {
  loadingMainQuery: boolean;
  counts: {
    byCP: Counts;
    byType: Counts;
  };
};

function Sidebar({ counts, loadingMainQuery }: Props) {
  return (
    <Wrapper.Sidebar hasBorder>
      {isEnabled('clientportal') && (
        <>
          <ClientPortalIdFilter counts={counts.byCP} />
          <TypeFilter counts={counts.byType} />
        </>
      )}
      {isEnabled('forms') && (
        <DateFilters
          type="clientportal:user"
          loadingMainQuery={loadingMainQuery}
        />
      )}
      {isEnabled('segments') && (
        <SegmentFilter
          type={'user'}
          loadingMainQuery={loadingMainQuery}
          // abortController={this.abortController}
        />
      )}
    </Wrapper.Sidebar>
  );
}

export default Sidebar;
