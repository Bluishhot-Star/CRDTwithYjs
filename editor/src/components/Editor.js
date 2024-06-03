import { React, useState, useEffect } from 'react'
import '../App.css';
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'
import { EditorContent, useEditor } from '@tiptap/react'
import { WebrtcProvider } from 'y-webrtc'
import * as Y from 'yjs'

  const ydoc = new Y.Doc()
  const provider = new WebrtcProvider('tiptap-collaboration-cursor-extension', ydoc)
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  let idx = getRandomInt(2);
  let names = ['A','B','C','D'];
  let colors = ['#f783ac', '#2563ac', '#dc3892', '38ac13'];
  export default () => {
    const editor = useEditor({
      extensions: [
        Document,
        Paragraph,
        Text,
        Collaboration.configure({
          document: ydoc,
        }),
        CollaborationCursor.configure({
          provider,
          user: {
            name: names[idx],
            color: colors[idx],
          },
        }),
        Placeholder.configure({
          placeholder:
            'Write something … It’ll be shared with everyone else looking at this example.',
        }),
      ],
    })
  
    return <EditorContent editor={editor} />
  }
