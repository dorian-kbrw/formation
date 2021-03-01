defmodule ElixTestTest do
  use ExUnit.Case
  doctest ElixTest

  test "greets the world" do
    assert ElixTest.hello() == :world
  end
end

defmodule MyGenericServer do
    use GenServer
end
