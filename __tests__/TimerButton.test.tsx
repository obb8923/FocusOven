import React from 'react';
import renderer from 'react-test-renderer';
import { TimerButton } from '../src/domain/AppMain/component/Timer/TimerButton';

const findTextNode = (node: renderer.ReactTestRendererJSON | renderer.ReactTestRendererJSON[] | null): renderer.ReactTestRendererJSON | null => {
  if (!node) return null;
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findTextNode(child);
      if (found) return found;
    }
    return null;
  }
  if (node.type === 'Text') {
    return node;
  }
  if (node.children) {
    for (const child of node.children) {
      const candidate = typeof child === 'object' ? findTextNode(child as renderer.ReactTestRendererJSON) : null;
      if (candidate) return candidate;
    }
  }
  return null;
};

describe('TimerButton', () => {
  it('renders label consistently', () => {
    const tree = renderer.create(<TimerButton timeLabel="25:00" onPress={() => {}} />).toJSON();
    const textNode = findTextNode(tree);
    expect(textNode?.children).toMatchInlineSnapshot(`
Array [
  "25:00",
]
`);
  });
});

