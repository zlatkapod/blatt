import { useRoute } from './lib/router'
import { Library } from './views/Library'
import { Editor } from './views/Editor'
import { PrintView } from './views/PrintView'
import { Sample } from './views/Sample'

export default function App() {
  const route = useRoute()
  return (
    <div className="app">
      {route.name === 'library' && <Library />}
      {route.name === 'sample' && <Sample />}
      {route.name === 'editor' && <Editor key={route.id} id={route.id} />}
      {route.name === 'print' && <PrintView key={route.id} id={route.id} />}
    </div>
  )
}
