defmodule Server.TheCreator do
  import Plug.Conn

defmacro my_get(my_path, do: expression) do
  function_name = String.to_atom(my_path)

    quote do
      @paths [unquote(function_name) | @paths]
      def unquote(function_name)() do
        unquote(expression)
      end
    end

end

defmacro my_error(code: my_code, content: my_content) do
  {my_code, my_content}
end

defmacro __using__(_opts) do
  quote do
    import Server.TheCreator
    @paths []
    @before_compile Server.TheCreator
  end
end

defmacro __before_compile__(_env) do
  quote do

    ## Functions before compiling ##
    def init(opts) do
      opts
    end

    def call(conn, _opts) do
      passed = false
      Enum.each @paths, fn name ->
        if (name == String.to_existing_atom(conn.request_path)) do
          {code, message} = apply(__MODULE__, name, [])
          send_resp(conn, code, message)
        end
      end
    end

    def run do
      Enum.each @paths, fn name ->
        apply(__MODULE__, name, [])
      end
    end
    ################################
  end
end

end
