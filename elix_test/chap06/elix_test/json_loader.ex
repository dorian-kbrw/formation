defmodule JsonLoader do
  def load_to_database(database, json_file) do
    {:ok, file_content} = File.read(json_file)
    {:ok, mapped_file} = Poison.decode(file_content)
    Task.async_stream(mapped_file, JsonLoader, :insert_to_riak, [database],
      max_concurrency: 10
    )
    |> Stream.run()
  end

  def insert_to_riak(object, _database) do
    key = object["id"]
    Riak.put_object("my_bucket", key, object)
  end

end
