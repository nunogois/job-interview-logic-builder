import { Argument } from '../types'

// Don't know if I was supposed to, but added an ArgsBuilder component to handle adding args, similar to OperationBuilder.
// Probably more complex than it needs to be, but was fun to do.
function ArgsBuilder(props: {
  value: Argument[]
  onChange: (value: Argument[]) => void
}): JSX.Element {
  // Adds a new argument, includes a bit of fun in getting the next number for the generated name.
  const add = () => {
    let number =
      props.value
        .map((arg) => +arg.name.split('Arg #')[1]) // + is my hacky shorthand for parseInt, since I need this to be a number.
        .sort((a, b) => b - a)[0] || 1 // Sort DESC and then [0] to get the biggest number, otherwise assume 1.

    while (
      props.value.some((arg) => arg.name === `Arg #${number}`) // We make sure our suggested name is unique, adding +1 to the number until it is.
    )
      number++

    props.onChange([
      ...props.value, // Spread operator to keep the existing args.
      new Argument(`Arg #${number}`) // Add our new arg using our constructor.
    ])
  }

  // Edit an argument, finding it in the array and assigning the new values to it.
  const edit = (id: string, name: string, value: boolean) => {
    const args = props.value
    let arg = args.find((arg) => arg.id === id)
    Object.assign(arg, { id, name, value })
    props.onChange([...args]) // This was weird for me but I imagine it's a React thing I need to research. props.onChange(args) should work on my mind.
    // I would say this now works because we are creating a new array instead of using a reference. I'm OK with it, but like I said, still found it weird.
    // I'm used to mutating variables directly when using other frameworks, in most cases.
  }

  // Render our component.
  return (
    <>
      {props.value.map(({ id, name, value }) => (
        <div key={id}>
          <input
            className="w-40 outline outline-1 focus:outline-white focus:outline-2 bg-transparent mb-2 py-1 px-2 text-sm rounded"
            value={name}
            onChange={(e) => edit(id, e.target.value, value)}
          />
          <select
            className={`w-20 mx-4 focus:outline-0 mb-2 p-1 text-sm rounded ${
              value ? 'bg-green-700' : 'bg-red-700'
            }`}
            value={value.toString()}
            onChange={(e) => edit(id, name, e.target.value === 'true')}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          <button
            className="w-16 text-sm bg-gray-600 px-2 py-1 rounded"
            onClick={() =>
              props.onChange([...props.value.filter((arg) => arg.id !== id)])
            }
          >
            Remove
          </button>
        </div>
      ))}
      <button
        className="w-40 text-sm bg-gray-600 px-2 py-1 rounded"
        onClick={add}
      >
        + Add Argument
      </button>
    </>
  )
}

export default ArgsBuilder
