'use client';
import React, { useEffect, useState } from 'react';
import { GSymbolOutlined } from './GSymbol';
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  Transition,
} from '@headlessui/react';
import { useAuth } from '@/app/context/AuthProvider';
import { pages, usePaging } from '@/app/context/PagingProvider';

export default function Header() {
  const { user, isLoading, signout } = useAuth();
  const { pageTo } = usePaging();

  const [localIsLoading, setLocalIsLoading] = useState<boolean>(true);
  useEffect(() => {
    setLocalIsLoading(isLoading);
  }, [isLoading]);

  const handleSignOut = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    signout();
  };

  const items = [
    {
      iconName: 'logout',
      title: 'Sign Out',
      subtitle: undefined,
      href: '#',
      onClick: handleSignOut,
    },
  ];

  return (
    <header>
      <div className="w-[100px]">
        <GSymbolOutlined
          fill={0}
          weight={400}
          opticalSize={36}
          iconColor="black"
        >
          timer
        </GSymbolOutlined>
      </div>

      {user && (
        <TabGroup
          onChange={(index) => {
            pageTo(pages[index]);
            console.log('Changed selected tab to:', pages[index]);
          }}
        >
          <TabList className="flex gap-4">
            {React.Children.toArray(
              pages.map((page) => (
                <Tab key={page} id="tab-item">
                  {page}
                </Tab>
              )),
            )}
          </TabList>
        </TabGroup>
      )}

      {localIsLoading ? (
        <></>
      ) : user ? (
        // Authenticated
        // https://headlessui.com/react/popover
        <Popover className="flex justify-end w-[100px]">
          <PopoverButton id="menu-btn">
            <GSymbolOutlined
              fill={0}
              weight={400}
              opticalSize={36}
              iconColor="black"
            >
              person
            </GSymbolOutlined>
          </PopoverButton>
          <Transition
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <PopoverPanel anchor="bottom" id="menu-panel">
              <div className="p-3">
                <p className="font-semibold text-inverseOnSurface">
                  {user.email}
                </p>
                <div className="my-1 h-px bg-white/5" />
                {React.Children.toArray(
                  items.map(
                    (item: {
                      iconName: string | undefined;
                      title: string;
                      subtitle: string | undefined;
                      href: string | undefined;
                      onClick: React.MouseEventHandler;
                    }) => (
                      <a
                        className="flex rounded-lg py-2 px-3 transition hover:bg-inverseOnSurface/5 gap-2 justify-start"
                        href={item.href}
                        onClick={item.onClick}
                      >
                        <GSymbolOutlined
                          fill={0}
                          weight={300}
                          opticalSize={24}
                          iconColor="rgb(var(--color-inverse-on-surface))"
                        >
                          {item.iconName}
                        </GSymbolOutlined>
                        <div>
                          <p className="font-semibold text-inverseOnSurface">
                            {item.title}
                          </p>
                          {item.subtitle && (
                            <p className="text-inverseOnSurface">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </a>
                    ),
                  ),
                )}
              </div>
            </PopoverPanel>
          </Transition>
        </Popover>
      ) : (
        // Not Authenticated
        <div className="profile">
          <a href="/signin">
            <GSymbolOutlined
              fill={0}
              weight={300}
              opticalSize={24}
              iconColor="black"
            >
              login
            </GSymbolOutlined>
          </a>
        </div>
      )}
    </header>
  );
}
