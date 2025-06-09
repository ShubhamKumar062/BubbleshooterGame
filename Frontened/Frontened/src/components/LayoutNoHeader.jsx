import { Outlet } from 'react-router-dom'

function LayoutNoHeader() {
  return (
    <div className="app">
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}

export default LayoutNoHeader
