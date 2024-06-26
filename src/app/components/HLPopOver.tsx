import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from '@headlessui/react';
import React from 'react';

export default function HLPopOver({
  btnName,
  items,
  labelColor,
}: {
  btnName: string;
  items: { title: string; subtitle: string | undefined }[];
  labelColor: string;
}) {
  return (
    <Popover>
      <PopoverButton id="menu-btn" className={`text-${labelColor}`}>
        {btnName}
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
            {React.Children.toArray(
              items.map(
                (item: { title: string; subtitle: string | undefined }) => (
                  <a
                    className="block rounded-lg py-2 px-3 transition hover:bg-white/5"
                    href="#"
                  >
                    <p className="font-semibold text-inverseOnSurface">
                      {item.title}
                    </p>
                    {item.subtitle && (
                      <p className="text-inverseOnSurface">{item.subtitle}</p>
                    )}
                  </a>
                ),
              ),
            )}
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
