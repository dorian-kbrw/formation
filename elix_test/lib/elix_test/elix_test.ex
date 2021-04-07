defmodule ElixTest do

  def start(_, _) do
    IO.inspect "Add reaxt in env"
    Application.put_env(
      :reaxt,:global_config,
      Map.merge(
        Application.get_env(:reaxt,:global_config), %{localhost: "http://localhost:4001"}
      )
    )
    Reaxt.reload
  end

end
