/*
Nuno Góis - 2022-01-20 - https://www.nunogois.com

Thank you for your time!
I really enjoyed this challenge 😀
As a friendly note, React is not my favorite front-end framework. 
I'm more of a Vue.js and Svelte guy. I like Quasar Framework.
I added tailwind as an external resource: https://tailwindcss.com/docs/installation/play-cdn
I'm not a design expert but hopefully this looks a bit nicer now.
Also added Prettier with my preferred (clean) code style.
This OOP version is more OOP-centric with classes and constructors. Check them out on types.ts.
Also added a Debug component in the end, if we want help visualizing what's happening behind the scenes.
*/

import './styles.css'

// Import useState hook from React.
import { useState } from 'react'

// Import types from types.ts.
import { Operation, Argument } from './types'

// Import our components.
import ArgsBuilder from './components/ArgsBuilder'
import OperationBuilder from './components/OperationBuilder'

// Import also our Debug component.
import Debug from './components/Debug'

// Evaluation function - Whether our operation returns true or false.
// This whole logic could probably be a lot simpler if I took more time to refactor it.
function evaluateOperation(operation: Operation, args: Argument[]): boolean {
  // Used the nullish coalescing operator (??) a couple of times for alternatives / defaults.
  // It's especially useful here since we are dealing with booleans.
  // Added some optional chaining operators because there's a chance the args array might be empty.

  if (operation.operator === 'const') {
    return operation.value ?? true // Get the const value, otherwise assume true.
  } else if (operation.operator === 'arg') {
    return (
      args.find((arg) => arg.id === operation.argument)?.value ?? // Try to find the respective argument.
      args[0]?.value ?? // If not found, grab the first one.
      true // Otherwise assume true.
    )
  } else if (
    operation.group.length &&
    (operation.operator === 'and' || operation.operator === 'or') // In case the operation has groups and its operator is "and" or "or"
  ) {
    // A reducer seemed like a very elegant solution to this problem.
    // Definitely better than an eventual evil temptation of doing eval / Function.
    // In our case there's only max 2 operations in group, but this is generic enough to support more complex cases.
    return operation.group // Map operations inside the group to the result of recursively calling this evaluation method. Then reduce that mapped array to a single value.
      .map((op) => evaluateOperation(op, args))
      .reduce(
        (acc, value) =>
          operation.operator === 'or' ? acc || value : acc && value, // Ternary that either does || or && to all the values of our array, depending on the operator.
        operation.operator !== 'or' // We want to start our acc as true/false depending on our operator, so we get the correct result in the end. This was a simple way of getting the correct boolean.
      )
  }

  return true // By default we assume true.
}

export default function App() {
  // Initiate our reactive variables using useState with types and defaults.
  const [operation, setOperation] = useState<Operation>(new Operation())
  const [args, setArgs] = useState<Argument[]>([])

  // Get our result so we can display it.
  const result = evaluateOperation(operation, args)

  // Render the page.
  return (
    <div className="bg-slate-800 rounded-xl p-8 m-10">
      <h4 className="text-xl mb-2">Arguments</h4>
      <ArgsBuilder value={args} onChange={setArgs} />
      <h4 className="text-xl mt-5 mb-2">Operation</h4>
      <OperationBuilder value={operation} args={args} onChange={setOperation} />
      <h4 className="text-xl mt-5 mb-2">Result</h4>
      <div
        className={`w-40 py-1 text-center text-lg font-bold capitalize tracking-wider rounded ring-2 ${
          result ? 'ring-green-600 text-green-500' : 'ring-red-600 text-red-500'
        }`}
      >
        {result.toString()}
      </div>
      <Debug args={args} operation={operation} />
    </div>
  )
}
