defmodule ElixTest.MixProject do
  use Mix.Project
  def project do
    [
      app: :elix_test,
      version: "0.1.0",
      elixir: "~> 1.11",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end
  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger, :cowboy],
      mod: {ElixTest.Application, []}
    ]
  end
  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:cowboy, "~> 1.1.2"},
      {:plug, "~> 1.3.4"},
      {:poison, "~> 3.1"}
    ]
  end
end
