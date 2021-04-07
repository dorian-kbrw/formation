defmodule ElixTest.MixProject do
  use Mix.Project
  def project do
    [
      app: :elix_test,
      version: "0.1.0",
      elixir: "~> 1.11",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      compilers: [:reaxt_webpack] ++ Mix.compilers
    ]
  end
  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      applications: [:reaxt],
      extra_applications: [:logger, :cowboy, :inets, :eex, :plug, :poison],
      mod: {ElixTest.Application, []}
    ]
  end
  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:reaxt, "~> 2.1.0", github: "kbrw/reaxt", tag: "2.1.0"},
      {:cowboy, "~> 1.1.2"},
      {:plug, "~> 1.3.4"},
      {:poison, "~> 3.1"}
    ]
  end
end
