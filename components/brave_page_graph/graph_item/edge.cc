/* Copyright (c) 2019 The Brave Software Team. Distributed under the MPL2
 * license. This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#include <string>
#include "brave/components/brave_page_graph/graph_item/edge.h"
#include "brave/components/brave_page_graph/graph_item.h"
#include "brave/components/brave_page_graph/types.h"

using ::std::string;

namespace brave_page_graph {

Edge::Edge(const PageGraphId id, const Node* in_node, const Node* out_node) :
    GraphItem(id) {
  in_node_ptr_ = in_node;
  out_node_ptr_ = out_node;
}

string Edge::ToStringPrefix() const {
  return in_node_ptr_->ItemName() + " -> ";
}

string Edge::ToStringSuffix() const {
  return " -> " + out_node_ptr_->ItemName();
}

}  // namespace brave_page_graph
