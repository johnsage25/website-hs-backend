import Document, { DocumentContext } from 'next/document';
import { ServerStyles, createStylesServer } from '@mantine/next';

// optional: you can provide your cache as a fist argument in createStylesServer function
const stylesServer = createStylesServer();

export default class _Document extends Document {

  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    const pageName = ctx.pathname.substring(1);


    // Add your app specific logic here

    return {
      ...initialProps,
      styles: [
        initialProps.styles,
        <body  key="styles" id={pageName?.replace(/[^0-9a-z\.]+/g, '')}><ServerStyles html={initialProps.html} server={stylesServer} key="styles" /></body>,
      ],
    };
  }
}
