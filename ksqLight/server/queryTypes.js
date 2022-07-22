const queryTypes = {
    runningQueries: "ksql_ksql_engine_query_stats_running_queries",
    rebalancingQueries: "ksql_ksql_engine_query_stats_rebalancing_queries",
    pendingShutdownQueries: "ksql_ksql_engine_query_stats_pending_shutdown_queries",
    pendingErrorQueries: "ksql_ksql_engine_query_stats_pending_error_queries",
    numPersistentQueries: "ksql_ksql_engine_query_stats_num_persistent_queries",
    numIdleQueries: "ksql_ksql_engine_query_stats_num_idle_queries",
    numActiveQueries: "ksql_ksql_engine_query_stats_num_active_queries",
    notRunningQueries: "ksql_ksql_engine_query_stats_not_running_queries",
    messagesProducedPerSec: "ksql_ksql_engine_query_stats_messages_produced_per_sec",
    messagesConsumedTotal: "ksql_ksql_engine_query_stats_messages_consumed_total",
    messagesConsumedPerSec: "ksql_ksql_engine_query_stats_messages_consumed_per_sec",
    messagesConsumedMin: "ksql_ksql_engine_query_stats_messages_consumed_min",
    messagesConsumedMax: "ksql_ksql_engine_query_stats_messages_consumed_max",
    messagesConsumedAvg: "ksql_ksql_engine_query_stats_messages_consumed_avg",
    livenessIndicator: "ksql_ksql_engine_query_stats_liveness_indicator",
    errorRate: "ksql_ksql_engine_query_stats_error_rate",
    errorQueries: "ksql_ksql_engine_query_stats_error_queries",
    createdQueries: "ksql_ksql_engine_query_stats_created_queries",
    bytesConsumedTotal: "ksql_ksql_engine_query_stats_bytes_consumed_total",
  };
  
  module.exports = queryTypes;
  