// https://docs.datadoghq.com/tracing/trace_collection/dd_libraries/nodejs/
import tracer from 'dd-trace';
tracer.init();
export default tracer;
