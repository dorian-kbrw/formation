defmodule Server.Stack do

  use Supervisor

  def init(init_value) do
    {:ok, init_value}
  end

  def start_link(_opts) do
    IO.inspect "LOAD STACK"
    children = [Server.Database]
    opts = [strategy: :one_for_one]
    {:ok, _pid} = Supervisor.start_link(children, opts)
    JsonLoader.load_to_database(:test, "/Users/doriandebout/Desktop/Formation - git/formation/elix_test/orders_dump/orders_chunk0.json")
    {:ok, _pid}
  end

end
