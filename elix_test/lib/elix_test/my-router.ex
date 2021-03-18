defmodule Server.Router do
  use Plug.Router

  plug Plug.Static, from: "lib/priv/static", at: "/static"
  plug :match
  plug :dispatch

  get "/api/orders" do
    body = Poison.encode!(Enum.map(Server.Database.get_table, fn {_key, map}-> map end))
    send_resp(conn, 200, body)
  end

  get _  do
    send_file(conn, 200, "lib/priv/static/index.html")
  end

end
