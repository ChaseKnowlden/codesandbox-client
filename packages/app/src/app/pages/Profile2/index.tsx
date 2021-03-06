/**
 * TODO:
 * - Mobile view
 * - Page number in url
 * - Filter out unlisted and private from API response
 * - Get more sandboxes than required to fill All Sandboxes (or filter featured)
 * - Custom drag preview
 * - Sort sandboxes
 * - Search sandboxes
 * - Sandbox picker
 * - Order sandboxes
 * - Likes tab
 */

import React from 'react';
import { useOvermind } from 'app/overmind';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { ThemeProvider, Stack, Menu, Element } from '@codesandbox/components';
import css from '@styled-system/css';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { Header } from './Header';
import { ProfileCard } from './ProfileCard';
import { ShowcaseSandbox } from './ShowcaseSandbox';
import { PinnedSandboxes } from './PinnedSandboxes';
import { AllSandboxes } from './AllSandboxes';

export const Profile = props => {
  const { username } = props.match.params;

  const {
    actions: {
      profile: { profileMounted },
    },
    state: {
      profile: { current: user },
    },
  } = useOvermind();

  React.useEffect(() => {
    profileMounted(username);
  }, [profileMounted, username]);

  const [menuVisible, setMenuVisibility] = React.useState(false);
  const [menuPosition, setMenuPosition] = React.useState({ x: null, y: null });
  const [selectedSandboxId, selectSandboxId] = React.useState(null);

  const onContextMenu = (event, sandboxId) => {
    event.preventDefault();
    selectSandboxId(sandboxId);
    setMenuVisibility(true);
    setMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const onKeyDown = (event, sandboxId) => {
    if (event.keyCode !== 18) return; // ALT

    selectSandboxId(sandboxId);
    setMenuVisibility(true);
    const rect = event.target.getBoundingClientRect();
    setMenuPosition({ x: rect.right, y: rect.bottom });
  };

  if (!user) return null;

  return (
    <ThemeProvider>
      <Stack
        direction="vertical"
        gap={104}
        css={css({
          height: '100%',
          width: '100vw',
          backgroundColor: 'grays.900',
          color: 'white',
          fontFamily: 'Inter, sans-serif',
        })}
      >
        <Header />

        <Stack
          gap={8}
          css={css({
            flexDirection: ['column', 'row'],
            marginX: [32, 64],
          })}
        >
          <Element css={css({ width: ['100%', '320px'] })}>
            <ProfileCard />
          </Element>
          <DndProvider backend={Backend}>
            <Stack direction="vertical" gap={14} css={{ flexGrow: 1 }}>
              <ShowcaseSandbox />
              <PinnedSandboxes menuControls={{ onContextMenu, onKeyDown }} />
              <AllSandboxes menuControls={{ onContextMenu, onKeyDown }} />
            </Stack>
          </DndProvider>
        </Stack>
      </Stack>
      <ContextMenu
        visible={menuVisible}
        setVisibility={setMenuVisibility}
        position={menuPosition}
        sandboxId={selectedSandboxId}
      />
    </ThemeProvider>
  );
};

const ContextMenu = ({ visible, setVisibility, position, sandboxId }) => {
  const {
    actions: {
      editor: { forkExternalSandbox },
      profile: {
        addFeaturedSandboxes,
        removeFeaturedSandboxes,
        changeSandboxPrivacy,
        deleteSandboxClicked,
      },
    },
    state: {
      user: loggedInUser,
      profile: { current: user },
    },
  } = useOvermind();

  const myProfile = loggedInUser?.username === user.username;

  const isFeatured = user.featuredSandboxes
    .map(sandbox => sandbox.id)
    .includes(sandboxId);

  return (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
    >
      {myProfile && (
        <>
          {isFeatured ? (
            <Menu.Item onSelect={() => removeFeaturedSandboxes({ sandboxId })}>
              Unpin sandbox
            </Menu.Item>
          ) : (
            <Menu.Item onSelect={() => addFeaturedSandboxes({ sandboxId })}>
              Pin sandbox
            </Menu.Item>
          )}
          <Menu.Divider />
        </>
      )}
      <Menu.Item
        onSelect={() => {
          location.href = sandboxUrl({ id: sandboxId });
        }}
      >
        Open sandbox
      </Menu.Item>
      <Menu.Item
        onSelect={() => {
          forkExternalSandbox({ sandboxId, openInNewWindow: true });
        }}
      >
        Fork sandbox
      </Menu.Item>
      {myProfile && !isFeatured && (
        <>
          <Menu.Divider />
          <Menu.Item
            onSelect={() => changeSandboxPrivacy({ sandboxId, privacy: 1 })}
          >
            Make sandbox unlisted
          </Menu.Item>
          <Menu.Item
            onSelect={() => changeSandboxPrivacy({ sandboxId, privacy: 2 })}
          >
            Make sandbox private
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item onSelect={() => deleteSandboxClicked(sandboxId)}>
            Delete sandbox
          </Menu.Item>
        </>
      )}
    </Menu.ContextMenu>
  );
};
