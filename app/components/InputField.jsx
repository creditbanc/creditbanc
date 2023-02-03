const InputField = ({
	label = "",
	placeholder = "",
	icon = false,
	type = "text",
	name = "",
	id = "",
	onChange = null,
	value,
}) => {
	return (
		<div className="input_component_container">
			<label
				htmlFor="email"
				className="block text-sm font-medium text-gray-700"
			>
				{label}
			</label>
			<div className="relative mt-1">
				<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					{icon}
				</div>

				<input
					type={type}
					name={name}
					id={id}
					onChange={onChange}
					className={`
                w-full 
                h-[38px] 
                p-[10px] 
                ${icon && "pl-[38px]"}
                rounded-md 
                border-solid 
                border-[1px] 
                border-gray-300 
                focus:border-indigo-500 
                focus:ring-indigo-500 
                shadow-sm 
                sm:text-sm
              `}
					placeholder={placeholder}
				/>
			</div>
		</div>
	);
};

export default InputField;
