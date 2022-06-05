import React, { useState } from 'react';

// First we need to add a type to let us extend the incoming component.
type ExtraInfoType = {
  extraInfo: string;
};

// Mark the function as a generic using P (or whatever variable you want)
export function WithInputAddUserProfile<P> (
  WrappedComponent: React.ComponentType<P>
) {
  const [value, setValue] = useState<String>("");

  const ComponentWithInputAddUserProfile = (props: P) => {
    // At this point, the props being passed in are the original props the component expects.
    return <WrappedComponent {...props} />;
  };
  return ComponentWithInputAddUserProfile;
}