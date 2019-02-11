namespace GL {
    export const enum GLConstants {
        /**Clearing buffers */
        DEPTH_BUFFER_BIT = 0x00000100,
        STENCIL_BUFFER_BIT = 0x00000400,
        COLOR_BUFFER_BIT = 0x00004000,
        /**Getting GL parameter information */
        VIEWPORT = 0x0BA2,
        COLOR_CLEAR_VALUE = 0x0C22,
        DEPTH_CLEAR_VALUE = 0x0B73,
        STENCIL_CLEAR_VALUE = 0x0B91,
        ARRAY_BUFFER_BINDING = 0x8894,
        ELEMENT_ARRAY_BUFFER_BINDING = 0x8895,
        /**Buffers */
        STATIC_DRAW = 0x88E4,
        STREAM_DRAW = 0x88E0,
        DYNAMIC_DRAW = 0x88E8,
        ARRAY_BUFFER = 0x8892,
        ELEMENT_ARRAY_BUFFER = 0x8893,
        BUFFER_SIZE = 0x8764,
        BUFFER_USAGE = 0x8765
    }
}