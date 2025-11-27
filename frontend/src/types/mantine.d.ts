/// <reference types="react" />

declare module '@mantine/core' {
  import * as React from 'react';
  
  export interface MantineComponent<P = {}> extends React.ForwardRefExoticComponent<P & React.RefAttributes<any>> {
    displayName?: string;
  }

  // Fix React.ReactNode compatibility
  type ReactNode = React.ReactNode;
  
  export const Card: MantineComponent<any> & {
    Section: MantineComponent<any>;
  };
  export const Container: MantineComponent<any>;
  export const Text: MantineComponent<any>;
  export const Title: MantineComponent<any>;
  export const Badge: MantineComponent<any>;
  export const Group: MantineComponent<any>;
  export const Avatar: MantineComponent<any>;
  export const Button: MantineComponent<any>;
  export const Divider: MantineComponent<any>;
  export const List: MantineComponent<any> & {
    Item: MantineComponent<any>;
  };
  export const ThemeIcon: MantineComponent<any>;
  export const Anchor: MantineComponent<any>;
  export const Stack: MantineComponent<any>;
  export const Image: MantineComponent<any>;
  export const BackgroundImage: MantineComponent<any>;
  export const Center: MantineComponent<any>;
  export const SimpleGrid: MantineComponent<any>;
  export const AspectRatio: MantineComponent<any>;
  export const UnstyledButton: MantineComponent<any>;
  export const Spoiler: MantineComponent<any>;
  export const ScrollArea: MantineComponent<any>;
  export const Grid: MantineComponent<any> & {
    Col: MantineComponent<any>;
  };
}
