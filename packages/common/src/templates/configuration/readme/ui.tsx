import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Text, Element, Link, Button } from '@codesandbox/components';
import css from '@styled-system/css';
import { fontSizes } from '@codesandbox/components/lib/design-language/typography';
import { Code } from './ui/code';
import { InlineCode } from './ui/inlineCode';

const Image = props => (
  <img
    {...props}
    alt={props.alt}
    css={css({
      maxWidth: '100%',
      borderRadius: 'small',
      maxHeight: '80vh',
    })}
  />
);

export const ConfigWizard = ({ file, openInText }) => (
  <Element
    css={css({
      fontFamily: 'Inter, sans-serif',
      'ul, ol': {
        paddingLeft: 0,
        fontSize: 13,
      },
      'ol li': {
        counterIncrement: 'counter',
      },
      'ol li::before': {
        color: 'mutedForeground',
        content: "counter(counter) '. '",
      },
      p: {
        margin: 0,
      },
      li: {
        listStyle: 'none',
      },
      'li:before': {
        content: "'•'",
        color: 'mutedForeground',
        paddingRight: '0.5em',
      },
    })}
  >
    <Button
      onClick={openInText}
      css={css({ position: 'absolute', width: '30%' })}
    >
      Open in Text
    </Button>
    <ReactMarkdown
      source={file}
      escapeHtml={false}
      renderers={{
        text: ({ children }) => (
          <Text
            variant="muted"
            size={3}
            css={css({
              wordBreak: 'break-all',
            })}
          >
            {children}
          </Text>
        ),
        heading: ({ children, level }) => {
          const headingLevel = level - 1;
          const sizes = fontSizes.reverse();
          return (
            <Text
              block
              variant="muted"
              style={{ fontSize: sizes[headingLevel] }}
              weight="bold"
            >
              {children}
            </Text>
          );
        },
        code: Code,
        image: Image,
        imageReference: Image,
        linkReference: p => <Link {...p}>{p.children}</Link>,
        inlineCode: InlineCode,
      }}
    />
  </Element>
);

export default {
  ConfigWizard,
};
