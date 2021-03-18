defmodule Server.Database do

  use GenServer

  @impl true
  def init(initial_value) do
    :ets.new(:test, [:named_table, :public])
    IO.puts "init db"
    {:ok, initial_value}
  end

  def start_link(initial_value) do
    {:ok, _pid} = GenServer.start_link(Server.Database, initial_value, name: __MODULE__)
  end

  def long_process do
    :timer.sleep(100)
    %{result: "Process result.."}
  end

  @impl true
  def handle_cast({:create, {database, key, value}}, names) do
    :ets.insert(database, {key, value})
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

  @impl true
  def handle_call({database, key}, _pid, names) do
    {:reply, :ets.lookup(database, key), names}
  end

  def handle_call(:get_table, _form, _table) do
    {:reply, :ets.tab2list(:test), :ets.tab2list(:test)}
  end

  def get_table do
    GenServer.call(__MODULE__, :get_table)
  end

  #@impl true
  #def handle_cast({:read, {database, key}}, names) do
  #  ret = :ets.lookup(database, key)
  #  {:noreply, ret}
  #end

  def create(database, {key, value}) do
    :ok = GenServer.cast(Server.Database, {:create, {database, key, value}})
    #long_process()
    {:ok}
  end

  #def read({database, key}) do
  #  :ok = GenServer.cast(Server.Database, {:read, {database, key}})
  #  {:ok}
  #end

  def read({database, key}) do
    GenServer.call(Server.Database, {database, key})
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
    tablist = :ets.tab2list(:test)

    my_list = Enum.reduce(list_key_value, [], fn x, ac ->
      my_key = List.first(Tuple.to_list(x))
      my_value = List.last(Tuple.to_list(x))

       t = Enum.reduce(tablist, [], fn xx, acc ->

        id = List.first(Tuple.to_list(xx))
        value = List.last(Tuple.to_list(xx))

        tt = Enum.reduce(value, [], fn xxx, accc ->
          if (List.first(Tuple.to_list(xxx)) == my_key && List.last(Tuple.to_list(xxx)) == my_value) do
            my_tuple = [{id, value}]
            accc ++ Enum.into(my_tuple, %{})
          else
            accc
          end

        end)

        if (tt != []) do
          acc = acc ++ tt
        else
          acc
        end

      end)

      if (t != []) do
        ac = ac ++ t
      else
        ac
      end

    end)

    my_final_list = [my_list]

    {:ok, my_final_list}

  end

end
