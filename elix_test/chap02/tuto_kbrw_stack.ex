#IO.puts "LANCEMENT tuto_kbrw_stack"
#{:ok, pid} = Server.Stack.start_link()
#Server.Stack.create(pid, :table)
#Server.Stack.update(pid, {:table, :key, "test"})
#Server.Stack.read(pid, {:table, :key})
#Server.Stack.delete(pid, :table)

{:ok} = JsonLoader.load_to_database(:test, "/Users/doriandebout/Desktop/Formation - git/formation/elix_test/orders_dump/orders_chunk0.json")

#Server.Database.start_link(:kv_db)
#{:ok} = Server.Database.create(:kv_db, {"toto", 42})
#{:ok} = Server.Database.create(:kv_db, {"test", "42"})
#{:ok} = Server.Database.create(:kv_db, {"tata", "Apero?"})
#{:ok} = Server.Database.create(:kv_db, {"kbrw", "Oh yeah"})

#IO.inspect Server.Database.search(:test, [{"order_date", 2018-05-16T13:50:34Z}])