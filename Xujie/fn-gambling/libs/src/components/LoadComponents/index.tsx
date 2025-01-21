import { useEffect, useState } from 'react';
import React from 'react';
const LoadComponents = ({
  list,
}: {
  // list: (() => Promise<{ default: () => JSX.Element }>)[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: any[];
}) => {
  const [components, setComponents] = useState<
    {
      id: number;
      component: () => JSX.Element;
    }[]
  >([]);
  useEffect(() => {
    const loadComponents = async () => {
      const loadedComponents = await Promise.all(
        list.map(async (item, index) => {
          const module = await item();
          return { id: index, component: module.default };
        })
      );

      setComponents(loadedComponents);
    };

    loadComponents();
  }, [list]);

  return (
    <>
      {components.map((item) => (
        <div key={item.id}>
          <item.component />
        </div>
      ))}
    </>
  );
};
export default LoadComponents;
