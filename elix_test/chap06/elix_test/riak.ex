defmodule Riak do

  def init(initial_value) do
    {:ok, initial_value}
  end

  def get_buckets() do
    {:ok, {{'HTTP/1.1', 200, 'OK'}, _headers, body}} = :httpc.request(:get, {'http://127.0.0.1:8098/buckets?buckets=true', []}, [], [])
    body
  end

  def get_keys(bucket) do
    url = "http://127.0.0.1:8098/buckets/" <> bucket <> "/keys?keys=true"
    {:ok, {{'HTTP/1.1', 200, 'OK'}, _headers, body}} = :httpc.request(:get, {url, []}, [], [])
    body
  end

  def get_object(bucket, key) do
    url = "http://127.0.0.1:8098/buckets/" <> bucket <> "/keys/" <> key
    {:ok, {{'HTTP/1.1', 200, 'OK'}, _headers, body}} = :httpc.request(:get, {url, []}, [], [])
    str_body = List.to_string(body)
    map_body = Poison.decode!(str_body)
    map_body
  end

  def put_object(bucket, key, object) do
    url = "http://127.0.0.1:8098/buckets/" <> bucket <> "/keys/" <> key
    :httpc.request(:post, {url, [], ["application/json"], Poison.encode!(object)}, [], [])
  end

  def delete_object(bucket, key) do
    url = "http://127.0.0.1:8098/buckets/" <> bucket <> "/keys/" <> key
    :httpc.request(:delete, {url, []}, [], [])
  end

  def upload_schema(schema_file, schema_name) do
    {:ok, schemaData} = File.read(schema_file)
    url = "http://127.0.0.1:8098/search/schema/" <> schema_name
    :httpc.request(:put, {url, [], ["application/xml"], schemaData}, [], [])
  end

  def upload_index(schema_name, index_name) do
    url = "http://127.0.0.1:8098/search/index/" <> index_name
    json_schema = "{\"schema\": \"" <> schema_name <> "\"}"
    :httpc.request(:put, {url, [], ["application/json"], json_schema}, [], [])
  end

  def assign_index(bucket_name, index_name) do
    url = "http://127.0.0.1:8098/buckets/" <> bucket_name <> "/props"
    data = "{\"props\": {\"search_index\": \"" <> index_name <> "\"}}"
    :httpc.request(:put, {url, [], ["application/json"], data}, [], [])
  end

  def delete_bucket(bucket_name) do
    keys = Riak.get_keys(bucket_name)
    str_keys = List.to_string(keys)
    map_keys = Poison.decode!(str_keys)
    {:ok, list_keys} = Map.fetch(map_keys, "keys")
    Enum.map(list_keys, fn x ->
      Riak.delete_object(bucket_name, x)
    end)
  end

  def nb_orders(bucket_name) do
    keys = Riak.get_keys(bucket_name)
    str_keys = List.to_string(keys)
    map_keys = Poison.decode!(str_keys)
    {:ok, list_keys} = Map.fetch(map_keys, "keys")
    nb = Enum.reduce(list_keys, 0, fn _x, acc ->
      acc = acc + 1
    end)
    nb
  end

  ##enlever delete -> re-put
  def update_bucket(bucket_name) do
    keys = Riak.get_keys(bucket_name)
    str_keys = List.to_string(keys)
    map_keys = Poison.decode!(str_keys)
    {:ok, list_keys} = Map.fetch(map_keys, "keys")
    map_keys_object = Enum.reduce(list_keys, %{}, fn x, acc ->
      acc = Map.put(acc, x, Riak.get_object(bucket_name, x))
    end)
    #Riak.delete_bucket(bucket_name)
    Enum.map(map_keys_object, fn x ->
      key = List.first(Tuple.to_list(x))
      object = List.last(Tuple.to_list(x))
      Riak.put_object(bucket_name, key, object)
    end)
  end

  def search(index, query, page, rows, sort) do
    start = 30 * (page - 1)
    url = "http://127.0.0.1:8098/search/query/" <> index <> "?wt=json&q=" <> query <> "&start=" <> Integer.to_string(start) <> "&rows=" <> Integer.to_string(rows) <> "&sort=" <> sort
    {:ok, {{_, _, _}, _headers, body}} = :httpc.request(:get, {url, []}, [], [])
    str_body = List.to_string(body)
    map_body = Map.fetch!(Map.fetch!(Poison.decode!(str_body), "response"), "docs")
    map_body
  end

  def my_fun(arg) when is_map(arg) do
    IO.inspect "map"
  end

  def my_fun(arg) when is_list(arg) do
    IO.inspect "list"
  end

  def my_fun(arg) when is_integer(arg) do
    IO.inspect "int"
  end

  def my_fun(_arg) do
    IO.inspect "nothing"
  end

end
