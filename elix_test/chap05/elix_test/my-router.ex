defmodule Server.Router do
  use Plug.Router

  plug Plug.Static, from: "lib/priv/static", at: "/static"
  plug :match
  plug :dispatch

  get "/api/orders" do
    body = Poison.encode!(Enum.map(Server.Database.get_table, fn {_key, map}-> map end))
    send_resp(conn, 200, body)
  end

  post "/api/delete" do
    {:ok, data, _conn} = read_body(conn)
    {:ok, res} = Poison.decode(data)
    {_key, value} = List.first(Map.to_list(res))
    Server.Database.delete({:test, value})
    body = Poison.encode!("CECI EST UN TEST")
    :timer.sleep(2000)
    send_resp(conn, 200, body)
  end

  get _  do
    send_file(conn, 200, "lib/priv/static/index.html")
  end

end
