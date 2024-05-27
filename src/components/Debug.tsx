// Import useState hook from React.
import { useState } from 'react'

// Import types from types.ts.
import { Operation, Argument } from '../types'

function Debug(props: { operation: Operation; args: Argument[] }): JSX.Element {
  const [debug, setDebug] = useState<boolean>(false)

  return (
    <>
      <br />
      <button
        className="w-40 text-xs bg-gray-600 mt-6 px-2 py-1 rounded"
        onClick={() => setDebug(!debug)}
      >
        {debug ? 'Debug: Hide' : 'Debug: Show'}
      </button>
      {debug && (
        <>
          <h4 className="text-xl mt-5 mb-2">Debug</h4>
          <h6>Arguments</h6>
          <pre className="bg-gray-900 my-2 rounded p-2">
            {JSON.stringify(props.args, null, 2)}
          </pre>
          <h6>Operation</h6>
          <pre className="bg-gray-900 mt-2 rounded p-2">
            {JSON.stringify(props.operation, null, 2)}
          </pre>
        </>
      )}
    </>
  )
}

export default Debug
