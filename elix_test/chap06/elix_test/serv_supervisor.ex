defmodule Server.Stack do

  use Supervisor

  def init(init_value) do
    {:ok, init_value}
  end

  def start_link(_opts) do
    IO.inspect "LOAD STACK"
    children = [Server.Database]
    opts = [strategy: :one_for_one]
    {:ok, pid} = Supervisor.start_link(children, opts)

    ###

    ##manual
    Riak.upload_schema("/Users/doriandebout/Desktop/Formation - git/formation/elix_test/riak/order_schema.xml", "my_schema")
    Riak.upload_index("my_schema", "my_index")
    Riak.assign_index("my_bucket", "my_index")

    #impl in db

    #Riak.delete_bucket("my_bucket")
    #Riak.update_bucket("my_bucket")
    JsonLoader.load_to_database(:test, "/Users/doriandebout/Desktop/Formation - git/formation/elix_test/orders_dump/orders_chunk0.json")
    #Riak.get_object("my_bucket", "nat_order000147702")
    #Riak.search("my_index", "id:nat_order*", 1, 3, "")
    {:ok, pid}
  end

end
