import { Operation, Operator, Argument } from '../types'

// Our operation component. Compared to the suggested declaration, I added args as a prop.
function OperationBuilder(props: {
  value: Operation
  args: Argument[]
  onChange: (value: Operation) => void
}): JSX.Element {
  const { operator, value, argument } = props.value // Destructuring from our Operation value.

  return (
    <div>
      <select
        className="w-40 outline outline-1 bg-transparent focus:outline-1 focus:outline-white mb-2 p-1 text-sm rounded"
        value={operator}
        onChange={(e) =>
          props.onChange({
            ...props.value,
            operator: e.target.value as Operator // Even though all of our options match Operator, I still cast it to keep TS happy and improve readability.
          })
        }
      >
        <option value="" className="text-gray-400">
          Select an option...
        </option>
        <option value="const">Constant</option>
        <option value="arg">Argument</option>
        <option value="and">And</option>
        <option value="or">Or</option>
      </select>
      {operator === 'const' && ( // If the selected operator is const, we display the true/false select.
        <select
          className={`w-20 ml-4 focus:outline-0 mb-2 p-1 text-sm rounded ${
            value ? 'bg-green-700' : 'bg-red-700'
          }`}
          value={value.toString()}
          onChange={(e) =>
            props.onChange({
              ...props.value,
              value: e.target.value === 'true' // A simple way of getting a boolean out of this - Whether the value equals the string "true".
            })
          }
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      )}
      {operator === 'arg' && ( // If the selected operator is arg, we display the args select.
        <select
          className="w-20 ml-4 outline outline-1 bg-transparent focus:outline-1 focus:outline-white mb-2 p-1 text-sm rounded"
          value={argument}
          onChange={(e) =>
            props.onChange({
              ...props.value,
              argument: e.target.value // Here we store the id of the arg to later match it and get the respective value.
            })
          }
        >
          {props.args.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      )}
      {operator !== '' && ( // If there's a selected operator, we display the Clear button here.
        <button
          className="ml-4 w-16 text-sm bg-gray-600 px-2 py-1 rounded"
          onClick={() => props.onChange(new Operation())}
        >
          Clear
        </button>
      )}
      {(operator === 'and' || operator === 'or') && ( // If the selected operator is one of the groups, display 2 more instances of our same component.
        <div style={{ paddingLeft: 10 }}>
          <OperationBuilder
            value={props.value.group[0] ?? new Operation()}
            args={props.args}
            onChange={(value) =>
              props.onChange({
                ...props.value,
                group: [value, props.value.group[1] ?? new Operation()] // This is currently super static: 2 in each group, so I'm taking advantage of that.
              })
            }
          />
          <OperationBuilder
            value={props.value.group[1] ?? new Operation()}
            args={props.args}
            onChange={(value) =>
              props.onChange({
                ...props.value,
                group: [props.value.group[0] ?? new Operation(), value] // We reinsert the other existing operation in the group. If it doesn't exist, we insert a new one.
              })
            }
          />
        </div>
      )}
    </div>
  )
}

export default OperationBuilder
