'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { SearchButton as OramaSearchButton, SearchBox } from '@orama/searchbox';
import type { OramaClient } from '@oramacloud/client';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { useState, type FC } from 'react';

import { WithSearchBox } from '@/components/Common/Search/States/WithSearchBox';
import { useDetectOS } from '@/hooks';
import { useKeyboardCommands } from '@/hooks/react-client';
import { client } from '@/next.orama.mjs';

import '@orama/searchbox/dist/index.css';
import styles from './index.module.css';

export const SearchButton: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  const openSearchBox = () => setIsOpen(true);
  const closeSearchBox = () => setIsOpen(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    console.log('SearchButton mounted wit theme ', resolvedTheme);
  }, [resolvedTheme]);

  useKeyboardCommands(cmd => {
    switch (cmd) {
      case 'cmd-k':
        openSearchBox();
        break;
      case 'escape':
        closeSearchBox();
        break;
      default:
    }
  });

  const { os } = useDetectOS();

  const osCommandKey = os === 'MAC' ? '⌘' : 'Ctrl';

  return (
    <>
      <OramaSearchButton
        label={t('components.search.searchBox.placeholder')}
        colorScheme={resolvedTheme}
      />
      <SearchBox
        oramaInstance={client as OramaClient}
        colorScheme={resolvedTheme}
        searchMode="fulltext"
        resultsMap={{
          path: 'path',
          title: 'pageTitle',
          description: 'pageSectionTitle',
          category: 'siteSection',
        }}
        showShowMoreLink
      />
      <button
        type="button"
        onClick={openSearchBox}
        className={styles.searchButton}
      >
        <MagnifyingGlassIcon className={styles.magnifyingGlassIcon} />

        {t('components.search.searchBox.placeholder')}
        <span title={`${osCommandKey} K`} className={styles.shortcutIndicator}>
          <kbd>{osCommandKey} K</kbd>
        </span>
      </button>

      {isOpen ? <WithSearchBox onClose={closeSearchBox} /> : null}
    </>
  );
};
