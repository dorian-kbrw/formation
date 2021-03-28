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
    body
  end

  def put_object(bucket, key, object) do
    url = "http://127.0.0.1:8098/buckets/" <> bucket <> "/keys/" <> key
    :httpc.request(:post, {url, [], 'text/plain', object}, [], [])
  end

  def delete_object(bucket, key) do
    url = "http://127.0.0.1:8098/buckets/" <> bucket <> "/keys/" <> key
    :httpc.request(:delete, {url, []}, [], [])
  end

end
