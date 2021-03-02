defmodule Server.Database do

  use GenServer

  @impl true
  def init(initial_value) do
    {:ok, initial_value}
  end

  def start_link(initial_value) do
    {:ok, _pid} = GenServer.start_link(Server.Database, initial_value, name: __MODULE__)
    :ets.new(initial_value, [:named_table, :public])
  end

  def long_process do
    :timer.sleep(500)
    %{result: "Process result.."}
  end

  @impl true
  def handle_cast({:create, {database, key, value}}, names) do
    :ets.insert(database, {key, value})
    {:noreply, names}
  end

  @impl true
  def handle_cast({:read, {database, key}}, names) do
    :ets.lookup(database, key)
    {:noreply, names}
  end

  @impl true
  def handle_cast({:update, {database, key, value}}, names) do
    :ets.insert(database, {key, value})
    {:noreply, names}
  end

  @impl true
  def handle_cast({:delete, {database, key}}, names) do
    :ets.delete(database, key)
    {:noreply, names}
  end

  def create(database, {key, value}) do
    :ok = GenServer.cast(Server.Database, {:create, {database, key, value}})
    long_process()
    {:ok}
  end

  def read({database, key}) do
    :ok = GenServer.cast(Server.Database, {:read, {database, key}})
    {:ok}
  end

  def update({database, key, value}) do
    :ok = GenServer.cast(Server.Database, {:update, {database, key, value}})
    {:ok}
  end

  def delete({database, key}) do
    :ok = GenServer.cast(Server.Database, {:delete, {database, key}})
    {:ok}
  end

  def search(database, list_key_value) do
    my_final_list = []
    my_final_list = Enum.reduce(list_key_value, my_final_list, fn x, acc -> acc ++ :ets.lookup(database, List.last(Tuple.to_list(x))) end)
    {:ok, my_final_list}
  end

end