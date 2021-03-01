defmodule JsonLoader do
  def load_to_database(database, json_file) do
    {:ok, file_content} = File.read(json_file)
    {:ok, mapped_file} = Poison.decode(file_content)
    #Server.Stack.start_link()
    Server.Database.start_link(database)
    {:ok} = loop(database, mapped_file)
  end

  def loop(database, mapped_file) do
    {map_iterator, rest} = List.pop_at(mapped_file, 0)

    if (map_iterator != nil) do
      {order_id, order_data} = get_order(map_iterator)
      if (order_id == :error) do
        IO.puts "FALSE"
      else
        Server.Database.create(database, {order_id, order_data})
      end
      loop(database, rest)
    else
      {:ok}
    end
  end

  def get_order(map_iterator) do

      if (Map.has_key?(map_iterator, "id")) do
        order_id = Map.get(map_iterator, "id")
        if (Map.has_key?(map_iterator, "custom")) do
          order_data = Map.get(map_iterator, "custom")
          {order_id, order_data}
        end
      else
        {:error, :error}
      end

  end

end