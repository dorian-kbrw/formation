defmodule Server.Router do
  use Plug.Router

  plug Plug.Static, from: "lib/priv/static", at: "/static"
  plug :match
  plug :dispatch

  get "/api/orders" do
    nb_orders = Riak.nb_orders("my_bucket")
    float_max_pages = nb_orders / 30
    max_pages = Kernel.round(float_max_pages) + 1
    tmp = %{"map" => Riak.search("my_index", "id:nat_order*", 1, 30, "creation_date_index%20asc"), "max_page" => max_pages}
    #map = Poison.encode!(Riak.search("my_index", "id:nat_order*", 1, 30, "creation_date_index%20asc"))
    send_resp(conn, 200, Poison.encode!(tmp))
  end

  post "/api/pagination" do
    {:ok, data, _conn} = read_body(conn)
    {:ok, res} = Poison.decode(data)
    {_actual, page} = List.first(Map.to_list(res))
    nb_orders = Riak.nb_orders("my_bucket")
    float_max_pages = nb_orders / 30
    max_pages = Kernel.round(float_max_pages) + 1
    if (page * 30 > nb_orders) do
      tmp = %{"map" => Riak.search("my_index", "id:nat_order*", page, nb_orders - ((page - 1) * 30), "creation_date_index%20asc"), "max_page" => max_pages}
      send_resp(conn, 200, Poison.encode!(tmp))
    else
      tmp = %{"map" => Riak.search("my_index", "id:nat_order*", page, 30, "creation_date_index%20asc"), "max_page" => max_pages}
      send_resp(conn, 200, Poison.encode!(tmp))
    end
  end

  post "/api/delete" do
    {:ok, data, _conn} = read_body(conn)
    {:ok, res} = Poison.decode(data)
    {_key, value} = List.first(Map.to_list(res))
    Riak.delete_object("my_bucket", value)
    body = Poison.encode!("CECI EST UN TEST")
    :timer.sleep(2000)
    send_resp(conn, 200, body)
  end

  get _  do
    send_file(conn, 200, "lib/priv/static/index.html")
  end

end
