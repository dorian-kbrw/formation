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
      Enum.each @paths, fn name ->
        #apply(__MODULE__, name, [])
        if (name == String.to_existing_atom(conn.request_path)) do
          apply(__MODULE__, name, [])
        end
      end
      send_resp(conn, 200, "ok")
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
