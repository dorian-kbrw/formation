defmodule Server.Router do
  use Plug.Router

  plug(:match)
  plug Plug.Parsers, parsers: [:json],
                     pass:  ["application/json"],
                     json_decoder: Jason
  plug(:dispatch)

  get "/" do
    send_resp(conn, 200, "Welcome")
  end

  get "/search" do
    my_list = Map.to_list(conn.params)
    t = Enum.reduce(my_list, [], fn x, acc ->
      acc ++ [List.last(Tuple.to_list(x))]
    end)

    id = Enum.join(for <<c::utf8 <- List.first(t)>>, do: <<c::utf8>>)
    value = Enum.join(for <<c::utf8 <- List.last(t)>>, do: <<c::utf8>>)

    my_tuple = {id, value}
    my_tuple_listed = [my_tuple]
    {:ok, data} = Server.Database.search(:test, my_tuple_listed)
    IO.inspect data
    send_resp(conn, 200, "search")
  end

  get "/create" do
    my_list = Map.to_list(conn.params)
    t = Enum.reduce(my_list, [], fn x, acc ->
      acc ++ [List.last(Tuple.to_list(x))]
    end)
    id = Enum.join(for <<c::utf8 <- List.first(t)>>, do: <<c::utf8>>)
    value = Enum.join(for <<c::utf8 <- List.last(t)>>, do: <<c::utf8>>)
    Server.Database.create(:test, {id, value})
    send_resp(conn, 200, "create")
  end

  get "/read" do
    my_list = Map.to_list(conn.params)
    t = Enum.reduce(my_list, [], fn x, acc ->
      acc ++ [List.last(Tuple.to_list(x))]
    end)
    key = Enum.join(for <<c::utf8 <- List.first(t)>>, do: <<c::utf8>>)
    ret = Server.Database.read({:test, key})
    send_resp(conn, 200, ret)
  end

  get "/update" do
    my_list = Map.to_list(conn.params)
    t = Enum.reduce(my_list, [], fn x, acc ->
      acc ++ [List.last(Tuple.to_list(x))]
    end)
    id = Enum.join(for <<c::utf8 <- List.first(t)>>, do: <<c::utf8>>)
    value = Enum.join(for <<c::utf8 <- List.last(t)>>, do: <<c::utf8>>)
    Server.Database.update({:test, id, value})
    send_resp(conn, 200, "update")
  end

  get "/delete" do
    my_list = Map.to_list(conn.params)
    t = Enum.reduce(my_list, [], fn x, acc ->
      acc ++ [List.last(Tuple.to_list(x))]
    end)
    key = Enum.join(for <<c::utf8 <- List.first(t)>>, do: <<c::utf8>>)
    Server.Database.delete({:test, key})
    send_resp(conn, 200, "delete")
  end

  match _ do
    send_resp(conn, 404, "Page Not Found")
  end

end
