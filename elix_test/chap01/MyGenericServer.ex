defmodule MyGenericServer do

    def init(init_arg) do
      {:ok, init_arg}
    end

    def loop({callback_module, server_state}) do
        receive do
            {:call, process_pid, request} ->
                {:reply, response, new_state} = callback_module.handle_call(request, process_pid, server_state)
                send(process_pid, {:response, response})
                loop({callback_module, new_state})

            {:cast, request} ->
                {:noreply, new_state} = callback_module.handle_cast(request, server_state)
                loop({callback_module, new_state})
        end
    end


    def cast(server_pid, request) do
        send(server_pid, {:cast, request})
    end


    def call(process_pid, request) do

        send(process_pid, {:call, self(), request})

        receive do
            {:response, response} ->
                response
        end
    end


    def start_link(callback_module, server_initial_state) do
        child = spawn_link(fn -> loop({callback_module, server_initial_state}) end)
        {:ok, child}
    end

end
