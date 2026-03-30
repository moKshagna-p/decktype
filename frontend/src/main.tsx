/* @refresh reload */
import { render } from 'solid-js/web'
import './app/styles/index.css'
import App from './app/app'

const root = document.getElementById('root')

render(() => <App />, root!)
