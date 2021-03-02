defmodule Server.Stack do

  def init(init_value) do
    {:ok, init_value}
  end

  def start_link() do
    children = [Server.Database]
    opts = [strategy: :one_for_one]
    {:ok, _pid} = Supervisor.start_link(children, opts)
  end

end