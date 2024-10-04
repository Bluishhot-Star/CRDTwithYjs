import { React, useState, useEffect, useCallback } from 'react'
import '../App.css';
import '../style/Editor.css'
import axios from 'axios';
// TipTap extension
// document
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
import Placeholder from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Dropcursor from '@tiptap/extension-dropcursor'
import Image from '@tiptap/extension-image'
import { all, createLowlight } from 'lowlight'



import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'

// collaboration
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'


import { EditorContent, useEditor } from '@tiptap/react'
import { Editor } from '@tiptap/core'
import {WebsocketProvider} from 'y-websocket'
import * as Y from 'yjs'

const ydoc = new Y.Doc()
const provider = new WebsocketProvider('ws://localhost:1234','10', ydoc)
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
let idx = getRandomInt(2);
let names = ['A','B','C','D'];
let colors = ['#f783ac', '#2563ac', '#dc3892', '38ac13'];

// create a lowlight instance with all languages loaded
const lowlight = createLowlight(all)

export default () => {
  useEffect(()=>{
    axios.get('http://localhost:8000/realtime/info/10', { responseType: 'arraybuffer' })  // 바이너리 데이터 요청
    .then(res => {
      // 서버가 바이너리 데이터로 응답할 경우
      const byteArray = new Uint8Array(res.data);

      if (byteArray.length === 0) {
        console.log('Received empty update');
        return;
      }

      console.log('Received update:', byteArray);

      // Yjs 문서에 업데이트 적용
      // Y.applyUpdate(byteArray);
      Y.logUpdate(byteArray)

      // const stateVector = Y.encodeStateVector(byteArray)

      // const diff = Y.encodeStateAsUpdate(ydoc, stateVector)
      Y.applyUpdate(ydoc, byteArray)
      // Y.encodeStateAsUpdate(byteArray)
    })
    .catch(err => {
      console.log(err);
    });
},[])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Paragraph.configure({
        HTMLAttributes: {
          class: 'editor-paragraph',
        },
      }),
      Text,
      Highlight,
      Typography,
      BulletList,
      ListItem,
      HorizontalRule,
      Image,
      Dropcursor,
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
          '입력하기',
      }),
    ],
  })
  const addImage = useCallback(() => {
    const url = window.prompt('URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])
  const MenuBar = ({editor}) => {
  
    if (!editor) {
      return null
    }
  
    return (
      <div className="control-group">
        <div className="button-group">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleBold()
                .run()
            }
            className={editor.isActive('bold') ? 'is-active' : ''}
          >
            Bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleItalic()
                .run()
            }
            className={editor.isActive('italic') ? 'is-active' : ''}
          >
            Italic
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleStrike()
                .run()
            }
            className={editor.isActive('strike') ? 'is-active' : ''}
          >
            Strike
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleCode()
                .run()
            }
            className={editor.isActive('code') ? 'is-active' : ''}
          >
            Code
          </button>
          <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
            Clear marks
          </button>
          <button onClick={() => editor.chain().focus().clearNodes().run()}>
            Clear nodes
          </button>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={editor.isActive('paragraph') ? 'is-active' : ''}
          >
            Paragraph
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
          >
            H3
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
          >
            H4
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
            className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
          >
            H5
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
            className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
          >
            H6
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'is-active' : ''}
          >
            Bullet list
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'is-active' : ''}
          >
            Ordered list
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'is-active' : ''}
          >
            Code block
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'is-active' : ''}
          >
            Blockquote
          </button>
          <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            Horizontal rule
          </button>
          <button onClick={() => editor.chain().focus().setHardBreak().run()}>
            Hard break
          </button>
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .undo()
                .run()
            }
          >
            Undo
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .redo()
                .run()
            }
          >
            Redo
          </button>
          <button
            onClick={() => editor.chain().focus().setColor('#958DF1').run()}
            className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
          >
            Purple
          </button>
          <button onClick={addImage}>Set image</button>
        </div>
      </div>
    )
  }
  
  const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
    }),
  ]

  return (
    <>
      <MenuBar editor={editor}/>
      <EditorContent editor={editor}/>
    </>
  )
}
